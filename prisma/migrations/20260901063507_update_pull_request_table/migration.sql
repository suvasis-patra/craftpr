/*
  Warnings:

  - You are about to drop the column `baseBranch` on the `pull_request` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `pull_request` table. All the data in the column will be lost.
  - Added the required column `prCreatedAt` to the `pull_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceBranch` to the `pull_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetBranch` to the `pull_request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PRStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "AIReviewStatus" AS ENUM ('PENDING', 'COMPLETE', 'PROCESSING', 'FAILED');

-- AlterTable
ALTER TABLE "pull_request" DROP COLUMN "baseBranch",
DROP COLUMN "status",
ADD COLUMN     "aiReviewStatus" "AIReviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "authorAvatarUrl" TEXT,
ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prCreatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "prStatus" "PRStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "sourceBranch" TEXT NOT NULL,
ADD COLUMN     "targetBranch" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ReviewStatus";

-- CreateIndex
CREATE INDEX "pull_request_installationId_idx" ON "pull_request"("installationId");

-- CreateIndex
CREATE INDEX "pull_request_repoFullName_idx" ON "pull_request"("repoFullName");
