/*
  Warnings:

  - Added the required column `amount` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "amount" INTEGER NOT NULL;
