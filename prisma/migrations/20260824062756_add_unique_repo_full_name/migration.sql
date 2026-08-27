/*
  Warnings:

  - A unique constraint covering the columns `[repoFullName]` on the table `RepoSync` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RepoSync_repoFullName_key" ON "RepoSync"("repoFullName");
