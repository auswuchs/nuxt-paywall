DROP INDEX "purchases_device_created_idx";--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
UPDATE "purchases" SET "expires_at" = "created_at" + CASE "offer_id" WHEN 'year' THEN interval '365 days' ELSE interval '30 days' END;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "purchases_device_expires_idx" ON "purchases" USING btree ("device_id","expires_at");
