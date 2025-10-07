/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `LeaderboardEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_userId_fkey";

-- AlterTable
ALTER TABLE "public"."LeaderboardEntry" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_key" ON "public"."LeaderboardEntry"("userId");

-- AddForeignKey
ALTER TABLE "public"."LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
