export default defineEventHandler(async (event): Promise<Entitlement> => {
  const { offerId, deviceId } = await readBodyOrFail(event, purchaseBodySchema)

  const entitlement = await createPurchase(offerId, deviceId)

  setResponseStatus(event, 201)
  return entitlement
})
