/*
  Warnings:

  - The primary key for the `FacebookLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `FacebookLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FacebookLike` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `contentUrl` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`, `name`);
