import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  offerId: text('offer_id').notNull(),
  price: integer('price').notNull(),
  deviceId: text('device_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Purchase = typeof purchases.$inferSelect
