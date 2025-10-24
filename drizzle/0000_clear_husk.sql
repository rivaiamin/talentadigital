CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talent" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"services" json,
	"status" text NOT NULL,
	"location" text,
	"contact_number" text,
	"description" text,
	"picture_url" text,
	"portfolio_url" text,
	"instagram_url" text,
	"facebook_url" text,
	"thread_url" text,
	"x_url" text,
	"linkedin_url" text,
	"pricing" text,
	CONSTRAINT "talent_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "talent_portfolio" (
	"id" text PRIMARY KEY NOT NULL,
	"talent_id" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2),
	"picture_url" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"age" integer,
	"username" text NOT NULL,
	"contact_number" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_contact_number_unique" UNIQUE("contact_number")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent" ADD CONSTRAINT "talent_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_portfolio" ADD CONSTRAINT "talent_portfolio_talent_id_talent_id_fk" FOREIGN KEY ("talent_id") REFERENCES "public"."talent"("id") ON DELETE no action ON UPDATE no action;