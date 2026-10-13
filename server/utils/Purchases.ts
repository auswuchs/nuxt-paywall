import { and, desc, eq, gt, sql } from 'drizzle-orm'

import { type Purchase, purchases } from '~~/server/db/Schema'

function toEntitlement(purchase: Purchase): Entitlement {
  return {
    purchaseId: purchase.id,
    offerId: purchase.offerId as OfferId,
    purchasedAt: purchase.createdAt.toISOString(),
    expiresAt: purchase.expiresAt.toISOString(),
  }
}

export async function createPurchase(
  offerId: OfferId,
  deviceId: string): Promise<Entitlement> {
  const offer = findOffer(offerId)

  // Обе даты считает БД по своим часам, чтобы срок был ровно createdAt + длительность.
  const [purchase] = await useDb()
    .insert(purchases)
    .values({
      offerId,
      deviceId,
      price: offer.price,
      expiresAt: sql`now() + make_interval(days => ${offer.durationDays})`,
    })
    .returning()

  return toEntitlement(purchase!)
}

export async function findActiveEntitlement(deviceId: string): Promise<Entitlement | undefined> {
  const [purchase] = await useDb()
    .select()
    .from(purchases)
    .where(and(
      eq(purchases.deviceId, deviceId),
      gt(purchases.expiresAt, sql`now()`),
    ))
    .orderBy(desc(purchases.expiresAt))
    .limit(1)

  return purchase && toEntitlement(purchase)
}
