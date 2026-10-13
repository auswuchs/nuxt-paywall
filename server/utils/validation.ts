import { z } from 'zod'

export const deviceIdSchema = z.string().trim().min(8).max(128)

export const purchaseBodySchema = z.object({
  offerId: z.enum(offerIds),
  deviceId: deviceIdSchema,
})
