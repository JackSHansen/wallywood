-- AlterTable
ALTER TABLE `posters` MODIFY `image` VARCHAR(255) NULL,
    MODIFY `width` INTEGER NULL,
    MODIFY `height` INTEGER NULL,
    MODIFY `price` DECIMAL(10, 2) NULL,
    MODIFY `stock` INTEGER NULL;
