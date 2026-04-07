-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `membership_number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `citizenship` VARCHAR(191) NOT NULL,
    `membership_type` ENUM('LIFE_MEMBER_INDIVIDUAL', 'BENEFACTOR_LIFE_MEMBER', 'PATRON_LIFE_MEMBER', 'INSTITUTIONAL_MEMBER') NOT NULL,
    `date_of_birth` DATETIME(3) NULL,
    `qualification` VARCHAR(191) NULL,
    `address_line1` VARCHAR(191) NULL,
    `address_line2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `form_id` BIGINT NOT NULL,
    `extra_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `members_membership_number_key`(`membership_number`),
    UNIQUE INDEX `members_form_id_key`(`form_id`),
    INDEX `members_email_idx`(`email`),
    INDEX `members_name_idx`(`name`),
    INDEX `members_membership_number_idx`(`membership_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `membership_forms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
