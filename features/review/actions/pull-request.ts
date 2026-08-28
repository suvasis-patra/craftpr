"use server";
import { TPullRequestWebhookPayload } from "@/features/github/utils/types";
import { prisma } from "@/lib/db";
import { ReviewStatus } from "@/lib/generated/prisma/enums";

export async function savePullRequest(data: TPullRequestWebhookPayload) {
  const { installation, pull_request, repository } = data;

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
      baseBranch: pull_request.base.ref,
      headSha: pull_request.head.sha,
      authorLogin: pull_request.user?.login,
      repoFullName: repository.full_name,
    },
    update: {
      title: data.pull_request.title,
      headSha: data.pull_request.head.sha,
      status: ReviewStatus.PENDING,
    },
  });
}

export async function markReviewProcessing(id: string) {
  return await prisma.pullRequest.update({
    where: { id },
    data: { status: ReviewStatus.PROCESSING },
  });
}

export async function markReviewComplted(id: string) {
  return await prisma.pullRequest.update({
    where: { id },
    data: { status: ReviewStatus.COMPLETE },
  });
}
