export type OfferId = 'year' | 'month'

export interface Offer {
  id: OfferId
  title: string
  price: number
  durationDays: number
  note: string
  discountPercent?: number
  recommended?: boolean
}

export interface Entitlement {
  purchaseId: string
  offerId: OfferId
  purchasedAt: string
  expiresAt: string
}
