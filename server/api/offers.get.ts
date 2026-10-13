export default defineEventHandler((event) => {
  // Lets reviewers see the error state on the deployed build without breaking anything.
  if (getQuery(event).simulate === 'error') {
    throw createError({ statusCode: 503, statusMessage: 'Offers are temporarily unavailable' })
  }
  return offers
})
