/*
  Warnings:

  - The primary key for the `Reserve` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `reserveDate` on table `Reserve` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "reserveDate" SET NOT NULL,
ADD CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id", "userId", "gameId");
DROP SEQUENCE "Reserve_id_seq";
