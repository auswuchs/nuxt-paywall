import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { purchases } from '../../db/schema'

const querySchema = z.object({ deviceId: deviceIdSchema })

export default defineEventHandler(async (event): Promise<PurchaseResult> => {
  const { deviceId } = await getValidatedQuery(event, querySchema.parse)

  const [purchase] = await useDb()
    .select()
    .from(purchases)
    .where(eq(purchases.deviceId, deviceId))
    .orderBy(desc(purchases.createdAt))
    .limit(1)

  if (!purchase) throw createError({ statusCode: 404, statusMessage: 'No purchases for this device' })

  return { id: purchase.id, offerId: purchase.offerId as OfferId, createdAt: purchase.createdAt.toISOString() }
})
