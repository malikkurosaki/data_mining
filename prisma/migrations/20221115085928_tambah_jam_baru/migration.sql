/*
  Warnings:

  - You are about to drop the column `keywordId` on the `TrainAi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TrainAi` DROP COLUMN `keywordId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
