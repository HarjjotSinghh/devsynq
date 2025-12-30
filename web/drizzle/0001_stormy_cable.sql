CREATE TABLE "cloud_sync_backups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"device_id" uuid,
	"data_type" text NOT NULL,
	"encrypted_data" text NOT NULL,
	"iv" text NOT NULL,
	"auth_tag" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"plaintext_hash" text NOT NULL,
	"plaintext_size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cloud_sync_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"device_id_hash" text NOT NULL,
	"device_name" text NOT NULL,
	"os" text NOT NULL,
	"app_version" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cloud_sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"device_id" uuid,
	"action" text NOT NULL,
	"data_type" text,
	"success" boolean NOT NULL,
	"error_message" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cloud_sync_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"access_key_hash" text NOT NULL,
	"encryption_salt" text NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_sync_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"plan_type" text DEFAULT 'free' NOT NULL,
	CONSTRAINT "cloud_sync_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cloud_sync_backups" ADD CONSTRAINT "cloud_sync_backups_user_id_cloud_sync_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cloud_sync_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_sync_backups" ADD CONSTRAINT "cloud_sync_backups_device_id_cloud_sync_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."cloud_sync_devices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_sync_devices" ADD CONSTRAINT "cloud_sync_devices_user_id_cloud_sync_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cloud_sync_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_sync_logs" ADD CONSTRAINT "cloud_sync_logs_user_id_cloud_sync_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cloud_sync_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cloud_sync_logs" ADD CONSTRAINT "cloud_sync_logs_device_id_cloud_sync_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."cloud_sync_devices"("id") ON DELETE set null ON UPDATE no action;