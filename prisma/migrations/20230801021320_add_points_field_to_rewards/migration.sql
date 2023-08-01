/*
  Warnings:

  - You are about to drop the column `status` on the `Redemption` table. All the data in the column will be lost.
  - Added the required column `points_required` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Redemption" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "points_required" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "REDEMPTION_STATUS";
