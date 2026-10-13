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

  const pickedOfferId = ref<OfferId>()
  const entitlement = ref<Entitlement>()
  const purchaseStatus = ref(PurchaseStatus.Idle)
  const restoreStatus = ref(RestoreStatus.Idle)

  const selectedOffer = computed(() => {
    return data.value.find((offer) => offer.id === pickedOfferId.value)
      ?? data.value.find((offer) => offer.recommended)
      ?? data.value[0]
  })

  const view = computed(() => {
    if (entitlement.value) return PaywallView.Success
    if (status.value === 'error') return PaywallView.Error
    if (status.value === 'success') return PaywallView.Ready
    return PaywallView.Loading
  })

  const purchasedOffer = computed(() =>
    data.value.find((offer) => offer.id === entitlement.value?.offerId),
  )

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
      entitlement.value = await $api.getEntitlement(deviceId.value)
      restoreStatus.value = RestoreStatus.Idle
    } catch (error) {
      restoreStatus.value = getApiErrorCode(error) === ApiErrorCode.EntitlementNotFound
        ? RestoreStatus.NotFound
        : RestoreStatus.Failed
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
