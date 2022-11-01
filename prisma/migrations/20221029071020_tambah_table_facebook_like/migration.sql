-- AlterTable
ALTER TABLE `FacebookLike` ADD COLUMN `keywordId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `FacebookLike` ADD CONSTRAINT `FacebookLike_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `Keyword`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
