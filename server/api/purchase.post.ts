import { purchases } from '../db/schema'

export default defineEventHandler(async (event): Promise<PurchaseResult> => {
  const { offerId, deviceId } = await readValidatedBody(event, purchaseBodySchema.parse)

  const [purchase] = await useDb()
    .insert(purchases)
    .values({ offerId, deviceId, price: findOffer(offerId).price })
    .returning()

  setResponseStatus(event, 201)
  return { id: purchase!.id, offerId, createdAt: purchase!.createdAt.toISOString() }
})
