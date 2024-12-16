/*
  Warnings:

  - You are about to drop the column `navigationDropId` on the `link` table. All the data in the column will be lost.
  - You are about to drop the column `navigationMainId` on the `link` table. All the data in the column will be lost.
  - Added the required column `navigationId` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `link` DROP FOREIGN KEY `Link_NavigationDrop_FK`;

-- DropForeignKey
ALTER TABLE `link` DROP FOREIGN KEY `Link_NavigationMain_FK`;

-- AlterTable
ALTER TABLE `link` DROP COLUMN `navigationDropId`,
    DROP COLUMN `navigationMainId`,
    ADD COLUMN `navigationId` INTEGER NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_navigationId_fkey` FOREIGN KEY (`navigationId`) REFERENCES `Navigation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
