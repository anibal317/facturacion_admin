/*
  Warnings:

  - You are about to drop the column `links` on the `navigation` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `navigation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `navigation` table. All the data in the column will be lost.
  - Added the required column `logoHref` to the `Navigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoIcon` to the `Navigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoText` to the `Navigation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `Navigation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `navigation` DROP COLUMN `links`,
    DROP COLUMN `logo`,
    DROP COLUMN `type`,
    ADD COLUMN `dropdownEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `logoHref` VARCHAR(191) NOT NULL,
    ADD COLUMN `logoIcon` VARCHAR(191) NOT NULL,
    ADD COLUMN `logoText` VARCHAR(191) NOT NULL,
    ADD COLUMN `section` ENUM('HOME', 'FEATURE') NOT NULL;

-- CreateTable
CREATE TABLE `Link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `navigationMainId` INTEGER NULL,
    `navigationDropId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_NavigationMain_FK` FOREIGN KEY (`navigationMainId`) REFERENCES `Navigation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_NavigationDrop_FK` FOREIGN KEY (`navigationDropId`) REFERENCES `Navigation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
