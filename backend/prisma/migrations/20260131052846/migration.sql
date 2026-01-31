/*
  Warnings:

  - You are about to drop the column `application_number` on the `membership_forms` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `application_number` ON `membership_forms`;

-- AlterTable
ALTER TABLE `membership_forms` DROP COLUMN `application_number`;
