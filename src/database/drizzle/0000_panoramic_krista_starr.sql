CREATE TABLE `todo` (
	`id` text PRIMARY KEY NOT NULL,
	`task` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `todo_task_unique` ON `todo` (`task`);