/*
  Warnings:

  - You are about to drop the column `lastNumber` on the `membershipCounter` table. All the data in the column will be lost.
  - Added the required column `last_number` to the `membershipCounter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `membershipCounter` DROP COLUMN `lastNumber`,
    ADD COLUMN `last_number` INTEGER NOT NULL;
