-- CreateTable
CREATE TABLE `TrainAi` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `result` JSON NULL,
    `content` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
