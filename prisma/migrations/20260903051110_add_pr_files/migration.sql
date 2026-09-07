-- CreateEnum
CREATE TYPE "PRFileStatus" AS ENUM ('ADDED', 'MODIFIED', 'DELETED', 'RENAMED');

-- CreateTable
CREATE TABLE "pr_file" (
    "id" TEXT NOT NULL,
    "pullRequestId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "status" "PRFileStatus" NOT NULL,
    "additions" INTEGER NOT NULL DEFAULT 0,
    "deletions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pr_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pr_file_pullRequestId_idx" ON "pr_file"("pullRequestId");

-- AddForeignKey
ALTER TABLE "pr_file" ADD CONSTRAINT "pr_file_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "pull_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
