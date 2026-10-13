export type OfferId = 'year' | 'month'

export interface Offer {
  id: OfferId
  title: string
  price: number
  note: string
  discountPercent?: number
  recommended?: boolean
}

export interface PurchaseResult {
  id: string
  offerId: OfferId
  createdAt: string
}
