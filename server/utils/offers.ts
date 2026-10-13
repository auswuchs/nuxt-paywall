export const offers: readonly Offer[] = [
  { id: 'year', title: 'Год', price: 1190, note: '≈ 99 ₽ в месяц', discountPercent: 50, recommended: true },
  { id: 'month', title: 'Месяц', price: 199, note: 'Отмена в любой момент' },
]

export const offerIds = offers.map((offer) => offer.id) as [OfferId, ...OfferId[]]

export function findOffer(id: OfferId) {
  return offers.find((offer) => offer.id === id)!
}
