import { PaywallView, PurchaseStatus, RestoreStatus } from '~/types/PaywallState'

export function usePaywall() {
  const route = useRoute()
  const { $api } = useNuxtApp()
  const deviceId = useDeviceId()
  const { notifyPurchased } = useNativeBridge()

  const simulate = typeof route.query.simulate === 'string' ? route.query.simulate : undefined

  const {
    data: offers,
    status: offersStatus,
    refresh: reloadOffers,
  } = useAsyncData('offers', () => $api.getOffers({ simulate }), {
    server: false,
    lazy: true,
    default: () => [],
  })

  const pickedOfferId = shallowRef<OfferId>()
  const entitlement = shallowRef<Entitlement>()
  const purchaseStatus = shallowRef(PurchaseStatus.Idle)
  const restoreStatus = shallowRef(RestoreStatus.Idle)

  const selectedOffer = computed(() =>
    offers.value.find((offer) => offer.id === pickedOfferId.value)
    ?? offers.value.find((offer) => offer.recommended)
    ?? offers.value[0],
  )

  const view = computed(() => {
    if (entitlement.value) return PaywallView.Success
    if (offersStatus.value === 'error') return PaywallView.Error
    if (offersStatus.value === 'success') return PaywallView.Ready
    return PaywallView.Loading
  })

  const purchasedOffer = computed(() =>
    offers.value.find((offer) => offer.id === entitlement.value?.offerId),
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
    offers,
    view,
    selectedOffer,
    purchasedOffer,
    purchaseStatus: readonly(purchaseStatus),
    restoreStatus: readonly(restoreStatus),
    selectOffer,
    reloadOffers,
    purchase,
    restore,
  }
}
