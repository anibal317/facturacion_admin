/*
  Warnings:

  - Added the required column `section` to the `benefit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `benefit` ADD COLUMN `section` ENUM('HOME', 'FEATURE') NOT NULL;
