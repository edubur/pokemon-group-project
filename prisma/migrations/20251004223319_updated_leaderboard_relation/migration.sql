/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_key" ON "public"."LeaderboardEntry"("userId");
