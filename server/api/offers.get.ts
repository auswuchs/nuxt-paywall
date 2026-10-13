export default defineEventHandler((event): readonly Offer[] => {
  // Даёт проверяющим увидеть состояние ошибки на проде, ничего не ломая.
  if (getQuery(event).simulate === 'error') {
    throw apiError(503, 'offers_unavailable', 'Offers are temporarily unavailable')
  }

  return offers
})
