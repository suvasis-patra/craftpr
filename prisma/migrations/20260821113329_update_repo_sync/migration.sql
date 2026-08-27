/*
  Warnings:

  - Added the required column `chunkCount` to the `RepoSync` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `installationId` on the `RepoSync` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RepoSync" ADD COLUMN     "chunkCount" INTEGER NOT NULL,
ADD COLUMN     "syncedAt" TIMESTAMP(3),
DROP COLUMN "installationId",
ADD COLUMN     "installationId" INTEGER NOT NULL;
