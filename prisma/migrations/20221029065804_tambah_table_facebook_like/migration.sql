/*
  Warnings:

  - You are about to drop the column `kotaAsa` on the `FacebookLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `FacebookLike` DROP COLUMN `kotaAsa`,
    ADD COLUMN `kotaAsal` VARCHAR(191) NULL;
