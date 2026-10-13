export function createPaywallApi(fetcher: typeof $fetch) {
  return {
    getOffers(params: { simulate?: string } = {}) {
      return fetcher<Offer[]>('/api/offers', { query: params })
    },

    purchase(body: PurchaseRequest) {
      return fetcher<Entitlement>('/api/purchase', { method: 'POST', body })
    },

    getEntitlement(deviceId: string) {
      return fetcher<EntitlementResponse>('/api/entitlement', { query: { deviceId } })
    },
  }
}

export type PaywallApi = ReturnType<typeof createPaywallApi>
