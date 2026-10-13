import { PaywallView, PurchaseStatus, RestoreStatus } from '~/types/PaywallState'

export function usePaywall() {
  const route = useRoute()
  const { $api } = useNuxtApp()
  const deviceId = useDeviceId()
  const { notifyPurchased } = useNativeBridge()

  const simulate = typeof route.query.simulate === 'string'
    ? route.query.simulate
    : undefined

  const {
    data,
    status,
    refresh,
  } = useAsyncData('offers', () => $api.getOffers({ simulate }), {
    server: false,
    lazy: true,
    default: () => [],
  })

  const {
    data: entitlement,
    status: entitlementStatus,
  } = useAsyncData('entitlement', fetchActiveEntitlement, {
    server: false,
    lazy: true,
    default: () => null,
  })

  const pickedOfferId = ref<OfferId>()
  const purchaseStatus = ref(PurchaseStatus.Idle)
  const restoreStatus = ref(RestoreStatus.Idle)

  const selectedOffer = computed(() => {
    return data.value.find((offer) => offer.id === pickedOfferId.value)
      ?? data.value.find((offer) => offer.recommended)
      ?? data.value[0]
  })

  const view = computed(() => {
    if (entitlement.value) return PaywallView.Success
    // Пока не знаем, куплен ли доступ, тарифы не показываем — иначе мелькнёт paywall перед экраном успеха.
    if (entitlementStatus.value === 'idle' || entitlementStatus.value === 'pending') return PaywallView.Loading
    if (status.value === 'error') return PaywallView.Error
    if (status.value === 'success') return PaywallView.Ready
    return PaywallView.Loading
  })

  const purchasedOffer = computed(() =>
    data.value.find((offer) => offer.id === entitlement.value?.offerId),
  )

  async function fetchActiveEntitlement() {
    try {
      return await $api.getEntitlement(deviceId.value)
    } catch (error) {
      if (getApiErrorCode(error) === ApiErrorCode.EntitlementNotFound) return null
      throw error
    }
  }

  function selectOffer(id: OfferId) {
    pickedOfferId.value = id
    purchaseStatus.value = PurchaseStatus.Idle
  }

  async function purchase() {
    if (!selectedOffer.value || purchaseStatus.value === PurchaseStatus.Pending) return

    purchaseStatus.value = PurchaseStatus.Pending
    try {
      entitlement.value = await $api.purchase({
        offerId: selectedOffer.value.id,
        deviceId: deviceId.value,
      })
      purchaseStatus.value = PurchaseStatus.Idle
      notifyPurchased(entitlement.value)
    } catch {
      purchaseStatus.value = PurchaseStatus.Failed
    }
  }

  async function restore() {
    if (restoreStatus.value === RestoreStatus.Pending) return

    restoreStatus.value = RestoreStatus.Pending
    try {
      entitlement.value = await fetchActiveEntitlement()
      restoreStatus.value = entitlement.value ? RestoreStatus.Idle : RestoreStatus.NotFound
    } catch {
      restoreStatus.value = RestoreStatus.Failed
    }
  }

  return {
    offers: data,
    reloadOffers: refresh,
    view,
    selectedOffer,
    purchasedOffer,
    purchaseStatus: readonly(purchaseStatus),
    restoreStatus: readonly(restoreStatus),
    selectOffer,
    purchase,
    restore,
  }
}
