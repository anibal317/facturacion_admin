-- CreateTable
CREATE TABLE `benefit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `icon` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `isStrikethrough` BOOLEAN NOT NULL DEFAULT false,
    `section` ENUM('HOME', 'FEATURE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` VARCHAR(191) NOT NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `originalPrice` DOUBLE NOT NULL,
    `discountedPrice` DOUBLE NULL,
    `freeMonths` INTEGER NULL,
    `purchasePoints` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Plan_planId_key`(`planId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planfeature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `savings` VARCHAR(191) NULL,
    `hasInfo` BOOLEAN NOT NULL DEFAULT false,
    `isPremium` BOOLEAN NOT NULL DEFAULT false,
    `planId` VARCHAR(191) NOT NULL,

    INDEX `PlanFeature_planId_fkey`(`planId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `video` BOOLEAN NOT NULL DEFAULT false,
    `videoLink` VARCHAR(191) NULL,

    UNIQUE INDEX `Feature_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `parentId` INTEGER NULL,
    `featureId` INTEGER NOT NULL,

    INDEX `Item_featureId_idx`(`featureId`),
    INDEX `Item_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Navigation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `section` ENUM('HOME', 'FEATURE') NOT NULL,
    `logoIcon` VARCHAR(191) NOT NULL,
    `logoText` VARCHAR(191) NOT NULL,
    `logoHref` VARCHAR(191) NOT NULL,
    `dropdownEnabled` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL,
    `navigationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `planfeature` ADD CONSTRAINT `PlanFeature_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plan`(`planId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `Item_featureId_fkey` FOREIGN KEY (`featureId`) REFERENCES `feature`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `Item_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_navigationId_fkey` FOREIGN KEY (`navigationId`) REFERENCES `Navigation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;