/*
  Warnings:

  - Added the required column `updatedAt` to the `TrainAi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TrainAi` ADD COLUMN `keywordId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
