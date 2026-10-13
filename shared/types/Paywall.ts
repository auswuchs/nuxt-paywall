export enum OfferId {
  Year = 'year',
  Month = 'month',
}

export interface Offer {
  id: OfferId
  title: string
  price: number
  durationDays: number
  note: string
  discountPercent?: number
  recommended?: boolean
}

export interface PurchaseRequest {
  offerId: OfferId
  deviceId: string
}

export interface Entitlement {
  purchaseId: string
  offerId: OfferId
  purchasedAt: string
  expiresAt: string
}
