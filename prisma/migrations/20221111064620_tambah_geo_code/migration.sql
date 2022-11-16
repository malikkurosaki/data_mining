-- CreateTable
CREATE TABLE `Lokasi` (
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `formattedAddress` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zipcode` VARCHAR(191) NULL,
    `streetName` VARCHAR(191) NULL,
    `streetNumber` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `neighbourhood` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NULL,

    PRIMARY KEY (`latitude`, `longitude`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE FULLTEXT INDEX `GoogleNews_title_idx` ON `GoogleNews`(`title`);
