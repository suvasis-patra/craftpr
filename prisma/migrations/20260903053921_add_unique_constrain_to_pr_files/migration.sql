/*
  Warnings:

  - A unique constraint covering the columns `[pullRequestId,filePath]` on the table `pr_file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pr_file_pullRequestId_filePath_key" ON "pr_file"("pullRequestId", "filePath");
