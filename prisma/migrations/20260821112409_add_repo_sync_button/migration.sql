-- CreateEnum
CREATE TYPE "RepoSyncStatus" AS ENUM ('PENDING', 'SYNCING', 'SYNCED', 'FAILED');

-- CreateTable
CREATE TABLE "RepoSync" (
    "id" TEXT NOT NULL,
    "installationId" TEXT NOT NULL,
    "status" "RepoSyncStatus" NOT NULL DEFAULT 'PENDING',
    "branch" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepoSync_pkey" PRIMARY KEY ("id")
);
