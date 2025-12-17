-- CreateTable
CREATE TABLE `Replacement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `rating` VARCHAR(50) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `type` VARCHAR(20) NULL,
    `issue` TEXT NOT NULL,
    `replacementSerialNumber` VARCHAR(50) NULL,
    `state` VARCHAR(50) NOT NULL,
    `customer` VARCHAR(100) NULL,
    `engineer` VARCHAR(100) NULL,
    `remark` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Replacement_serialNumber_key`(`serialNumber`),
    INDEX `Replacement_date_idx`(`date`),
    INDEX `Replacement_state_idx`(`state`),
    INDEX `Replacement_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
