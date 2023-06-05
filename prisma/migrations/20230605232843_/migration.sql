/*
  Warnings:

  - You are about to alter the column `preparationTime` on the `Recipes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Recipes` MODIFY `preparationTime` INTEGER NOT NULL;
