-- CreateTable
CREATE TABLE `TwitterLates` (
    `userName` VARCHAR(191) NOT NULL,
    `userUrl` VARCHAR(191) NOT NULL,
    `contentId` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,
    `location` VARCHAR(191) NOT NULL,
    `keywordId` VARCHAR(191) NULL,

    PRIMARY KEY (`userName`, `contentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TwitterLates` ADD CONSTRAINT `TwitterLates_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `Keyword`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
