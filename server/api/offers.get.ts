export default defineEventHandler((event): readonly Offer[] => {
  // Lets reviewers see the error state on the deployed build without breaking anything.
  if (getQuery(event).simulate === 'error') {
    throw apiError(503, 'offers_unavailable', 'Offers are temporarily unavailable')
  }

  return offers
})
