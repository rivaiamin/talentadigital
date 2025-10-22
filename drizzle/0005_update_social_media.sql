-- Add new social media columns
ALTER TABLE `talent` ADD `facebook_url` text;--> statement-breakpoint
ALTER TABLE `talent` ADD `thread_url` text;--> statement-breakpoint
-- Rename twitter_url to x_url (keeping the data)
ALTER TABLE `talent` ADD `x_url` text;--> statement-breakpoint
UPDATE `talent` SET `x_url` = `twitter_url` WHERE `twitter_url` IS NOT NULL;--> statement-breakpoint
-- Drop old social media columns
ALTER TABLE `talent` DROP COLUMN `twitter_url`;--> statement-breakpoint
ALTER TABLE `talent` DROP COLUMN `github_url`;--> statement-breakpoint
ALTER TABLE `talent` DROP COLUMN `dribbble_url`;--> statement-breakpoint
ALTER TABLE `talent` DROP COLUMN `behance_url`;
