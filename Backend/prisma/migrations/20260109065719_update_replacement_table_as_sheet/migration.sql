/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `Replacement` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Replacement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- DropIndex
DROP INDEX `Replacement_date_idx` ON `Replacement`;

-- DropIndex
DROP INDEX `Replacement_serialNumber_key` ON `Replacement`;

-- AlterTable
ALTER TABLE `Replacement` DROP COLUMN `serialNumber`,
    ADD COLUMN `additionalComments` TEXT NULL,
    ADD COLUMN `faultySerialNumber` VARCHAR(100) NULL,
    ADD COLUMN `stockType` VARCHAR(50) NULL,
    MODIFY `replacementSerialNumber` VARCHAR(100) NULL,
    MODIFY `customer` VARCHAR(150) NULL,
    MODIFY `status` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE INDEX `Replacement_faultySerialNumber_idx` ON `Replacement`(`faultySerialNumber`);
