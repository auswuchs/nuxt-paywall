CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offer_id" text NOT NULL,
	"price" integer NOT NULL,
	"device_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
