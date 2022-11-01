-- CreateTable
CREATE TABLE `FacebookLike` (
    `contentUrl` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profileUrl` TEXT NULL,
    `kotaSaatIni` VARCHAR(191) NULL,
    `kotaAsa` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`contentUrl`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
