"use server";

import { getServerSession } from "@/features/auth/actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { getGithubInstallationIdByUserId } from "@/features/github/server/github-app";

import { redirect } from "next/navigation";
import { triggerRepoSync } from "../server/repo-sync";
import { prisma } from "@/lib/db";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";

export async function syncRepo({
  repoFullName,
  branch,
}: {
  repoFullName: string;
  branch: string;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/sign-in");
  }
  const installationId = await getGithubInstallationIdByUserId(session.user.id);
  if (!installationId) {
    redirect(DASHBOARD_ROUTES.github);
  }
  const repo = await getRepoSyncStatusByRepoFullName(repoFullName);

  if (repo && repo.status === RepoSyncStatus.SYNCED) {
    return RepoSyncStatus.SYNCED;
  }
  if (repo && repo.status === RepoSyncStatus.SYNCING) {
    return RepoSyncStatus.SYNCING;
  }
  return await triggerRepoSync({ installationId, repoFullName, branch });
}

export async function markRepoAsSyncing(id: string) {
  return await prisma.repoSync.update({
    where: { id },
    data: { status: RepoSyncStatus.SYNCING },
  });
}

export async function markRepoAsSynced({
  id,
  chunkCount,
}: {
  id: string;
  chunkCount: number;
}) {
  await prisma.repoSync.update({
    where: { id },
    data: { status: RepoSyncStatus.SYNCED, chunkCount, syncedAt: new Date() },
  });
}

export async function markRepoSyncAsFailed(id: string) {
  await prisma.repoSync.update({
    where: { id },
    data: { status: RepoSyncStatus.FAILED },
  });
}

export async function getRepoSyncByRepoFullName(repoFullName: string) {
  return await prisma.repoSync.findUnique({ where: { repoFullName } });
}

export async function markRepoSyncAsPending(repoFullName: string) {
  return await prisma.repoSync.update({
    where: { repoFullName },
    data: { status: "PENDING" },
  });
}

export async function getRepoSyncStatusByRepoFullName(repoFullName: string) {
  return await prisma.repoSync.findUnique({
    where: { repoFullName },
    select: { status: true },
  });
}
