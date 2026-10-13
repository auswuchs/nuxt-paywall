export default defineEventHandler((event): readonly Offer[] => {
  // Даёт проверяющим увидеть состояние ошибки на проде, ничего не ломая.
  if (getQuery(event).simulate === SimulateMode.Error) {
    throw apiError(503, ApiErrorCode.OffersUnavailable, 'Offers are temporarily unavailable')
  }

  return offers
})
