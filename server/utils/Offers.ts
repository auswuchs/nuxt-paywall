export const offers: readonly Offer[] = [
  {
    id: OfferId.Year,
    title: 'Год',
    price: 1190,
    durationDays: 365,
    note: 'Всего 99 ₽ в месяц',
    discountPercent: 50,
    recommended: true,
  },
  {
    id: OfferId.Month,
    title: 'Месяц',
    price: 199,
    durationDays: 30,
    note: 'Отмена в любой момент',
  },
]

export function findOffer(id: OfferId) {
  return offers.find((offer) => offer.id === id)!
}
