CREATE TABLE "downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"os" text NOT NULL,
	"version" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stats_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"confirmed" boolean DEFAULT false,
	"source" text DEFAULT 'website',
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
