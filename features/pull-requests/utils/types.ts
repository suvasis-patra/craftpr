import { AIReviewStatus, PRStatus } from "@/lib/generated/prisma/enums";

export type TPrFilter = "all" | "open" | "closed" | "draft";

export type TPullRequestItem = {
  id: string;
  installationId: number;
  repoFullName: string;
  prNumber: number;

  title: string;
  authorLogin: string | null;
  authorAvatarUrl: string | null;

  sourceBranch: string;
  targetBranch: string;
  headSha: string;

  filesChanged: number;
  prCreatedAt: Date;

  prStatus: PRStatus;
  isDraft: boolean;

  aiReviewStatus: AIReviewStatus;
  reviewComment: string | null;
  reviewedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};
