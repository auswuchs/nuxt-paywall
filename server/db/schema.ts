import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  offerId: text('offer_id').notNull(),
  price: integer('price').notNull(),
  deviceId: text('device_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index('purchases_device_created_idx').on(table.deviceId, table.createdAt)])

export type Purchase = typeof purchases.$inferSelect
