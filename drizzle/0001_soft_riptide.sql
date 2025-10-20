CREATE TABLE `talent` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`services` text,
	`status` text NOT NULL,
	`location` text,
	`contact_number` text,
	`description` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `talent_portfolio` (
	`id` text PRIMARY KEY NOT NULL,
	`talent_id` text NOT NULL,
	`description` text NOT NULL,
	`price` real,
	`picture_url` text,
	FOREIGN KEY (`talent_id`) REFERENCES `talent`(`id`) ON UPDATE no action ON DELETE no action
);
