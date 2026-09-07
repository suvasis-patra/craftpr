"use server";
import { TPullRequestWebhookPayload } from "@/features/github/utils/types";
import { prisma } from "@/lib/db";
import { AIReviewStatus } from "@/lib/generated/prisma/enums";
import { TPrPatch } from "../utils/types";

export async function savePrPatches(data: TPrPatch) {
  const { filePath, patch, pullRequestId, status, additions, deletions } = data;
  await prisma.pRFile.upsert({
    where: {
      pullRequestId_filePath: {
        pullRequestId,
        filePath,
      },
    },
    create: {
      pullRequestId,
      filePath,
      patch,
      status,
      additions: additions ?? 0,
      deletions: deletions ?? 0,
    },
    update: { patch, status, additions, deletions },
  });
}

export async function savePullRequest(data: TPullRequestWebhookPayload) {
  const { installation, pull_request, repository, sender } = data;

  return await prisma.pullRequest.upsert({
    where: {
      repoFullName_prNumber: {
        repoFullName: repository.full_name,
        prNumber: pull_request.number,
      },
    },
    create: {
      prNumber: pull_request.number,
      title: pull_request.title,
      installationId: installation.id,
      targetBranch: pull_request.base.ref,
      sourceBranch: pull_request.head.ref,
      prCreatedAt: pull_request.created_at,
      headSha: pull_request.head.sha,
      authorLogin: sender.login,
      authorAvatarUrl: sender.avatra_url,
      repoFullName: repository.full_name,
      filesChanged: pull_request.changed_files,
    },
    update: {
      title: data.pull_request.title,
      headSha: data.pull_request.head.sha,
      aiReviewStatus: AIReviewStatus.PENDING,
      filesChanged: pull_request.changed_files,
    },
  });
}

export async function markReviewProcessing(id: string) {
  const pr = await prisma.pullRequest.update({
    where: { id },
    data: { aiReviewStatus: AIReviewStatus.PROCESSING },
  });
  return {
    repoFullName: pr.repoFullName,
    installationId: pr.installationId,
    prNumber: pr.prNumber,
    title: pr.title,
  } as const;
}

export async function markReviewComplted(id: string, reviewComment?: string) {
  return await prisma.pullRequest.update({
    where: { id },
    data: {
      aiReviewStatus: AIReviewStatus.COMPLETE,
      reviewComment: reviewComment ?? null,
      reviewedAt: new Date(),
    },
  });
}
