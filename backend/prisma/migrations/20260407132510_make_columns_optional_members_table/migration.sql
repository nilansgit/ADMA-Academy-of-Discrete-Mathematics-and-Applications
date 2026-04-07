-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_form_id_fkey`;

-- AlterTable
ALTER TABLE `members` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `citizenship` VARCHAR(191) NULL,
    MODIFY `form_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `membership_forms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
