import { TPullRequestItem } from "./types";

export const dummyPullRequests: TPullRequestItem[] = [
  {
    id: "clpr001",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 42,

    title: "Add JWT authentication",
    authorLogin: "suvasis-patra",
    authorAvatarUrl: "https://github.com/identicons/suvasis-patra.png",

    sourceBranch: "feature/jwt-auth",
    targetBranch: "main",
    headSha: "a8f3c91d2e7b4f6a9c1e8d5b3f2a7c9e",

    filesChanged: 8,
    prCreatedAt: new Date("2026-09-01T08:30:00.000Z"),

    prStatus: "OPEN",
    isDraft: false,

    aiReviewStatus: "COMPLETE",
    reviewComment: "Found 2 issues that should be addressed before merging.",
    reviewedAt: new Date("2026-09-01T08:35:42.000Z"),

    createdAt: new Date("2026-09-01T08:30:05.000Z"),
    updatedAt: new Date("2026-09-01T08:35:42.000Z"),
  },

  {
    id: "clpr002",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 41,

    title: "Fix Redis connection handling",
    authorLogin: "rahul-dev",
    authorAvatarUrl: "https://github.com/identicons/rahul-dev.png",

    sourceBranch: "fix/redis-connection",
    targetBranch: "main",
    headSha: "b7e4d2f91a6c3e8b5d9f2a7c4e1b6d8f",

    filesChanged: 4,
    prCreatedAt: new Date("2026-08-31T14:20:00.000Z"),

    prStatus: "OPEN",
    isDraft: false,

    aiReviewStatus: "PROCESSING",
    reviewComment: null,
    reviewedAt: null,

    createdAt: new Date("2026-08-31T14:20:04.000Z"),
    updatedAt: new Date("2026-09-01T07:10:21.000Z"),
  },

  {
    id: "clpr003",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 40,

    title: "Update dashboard UI",
    authorLogin: "ananya-dev",
    authorAvatarUrl: "https://github.com/identicons/ananya-dev.png",

    sourceBranch: "feature/dashboard-ui",
    targetBranch: "main",
    headSha: "c3a8f1e7b2d9c6a4f5e8b1d3c7a9f2e6",

    filesChanged: 16,
    prCreatedAt: new Date("2026-08-30T10:15:00.000Z"),

    prStatus: "OPEN",
    isDraft: true,

    aiReviewStatus: "PENDING",
    reviewComment: null,
    reviewedAt: null,

    createdAt: new Date("2026-08-30T10:15:03.000Z"),
    updatedAt: new Date("2026-08-30T10:15:03.000Z"),
  },

  {
    id: "clpr004",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 39,

    title: "Implement GitHub webhook verification",
    authorLogin: "suvasis-patra",
    authorAvatarUrl: "https://github.com/identicons/suvasis-patra.png",

    sourceBranch: "feature/webhook-verification",
    targetBranch: "main",
    headSha: "d9f2a6c3e7b1d8f4a5c9e2b6d3f7a1c8",

    filesChanged: 6,
    prCreatedAt: new Date("2026-08-29T09:45:00.000Z"),

    prStatus: "CLOSED",
    isDraft: false,

    aiReviewStatus: "COMPLETE",
    reviewComment: "No critical issues found. The implementation looks good.",
    reviewedAt: new Date("2026-08-29T10:02:15.000Z"),

    createdAt: new Date("2026-08-29T09:45:02.000Z"),
    updatedAt: new Date("2026-08-29T11:30:00.000Z"),
  },

  {
    id: "clpr005",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 38,

    title: "Refactor database queries",
    authorLogin: "amit-codes",
    authorAvatarUrl: "https://github.com/identicons/amit-codes.png",

    sourceBranch: "refactor/database",
    targetBranch: "develop",
    headSha: "e1b7c4d9f2a6e8c3b5d7f1a9c6e2b8d4",

    filesChanged: 12,
    prCreatedAt: new Date("2026-08-28T16:40:00.000Z"),

    prStatus: "CLOSED",
    isDraft: false,

    aiReviewStatus: "FAILED",
    reviewComment: null,
    reviewedAt: null,

    createdAt: new Date("2026-08-28T16:40:02.000Z"),
    updatedAt: new Date("2026-08-28T17:05:32.000Z"),
  },

  {
    id: "clpr006",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 37,

    title: "Add pull request review comments",
    authorLogin: "rahul-dev",
    authorAvatarUrl: "https://github.com/identicons/rahul-dev.png",

    sourceBranch: "feature/review-comments",
    targetBranch: "main",
    headSha: "f4c8a2e7d1b9f3c6a5e8d2b7c1f6a9e3",

    filesChanged: 9,
    prCreatedAt: new Date("2026-08-27T12:10:00.000Z"),

    prStatus: "CLOSED",
    isDraft: false,

    aiReviewStatus: "COMPLETE",
    reviewComment: "Review completed successfully. No blocking issues found.",
    reviewedAt: new Date("2026-08-27T12:25:40.000Z"),

    createdAt: new Date("2026-08-27T12:10:03.000Z"),
    updatedAt: new Date("2026-08-27T15:45:12.000Z"),
  },

  {
    id: "clpr007",
    installationId: 12345678,
    repoFullName: "suvasis-patra/craftpr-test",
    prNumber: 36,

    title: "Improve error handling",
    authorLogin: "dev-raj",
    authorAvatarUrl: "https://github.com/identicons/dev-raj.png",

    sourceBranch: "fix/error-handling",
    targetBranch: "main",
    headSha: "a2d7f9c4e1b6d8f3a5c7e2b9d4f1a8c6",

    filesChanged: 5,
    prCreatedAt: new Date("2026-08-26T08:50:00.000Z"),

    prStatus: "OPEN",
    isDraft: false,

    aiReviewStatus: "COMPLETE",
    reviewComment: "3 potential issues detected. Please review the findings.",
    reviewedAt: new Date("2026-08-26T09:12:08.000Z"),

    createdAt: new Date("2026-08-26T08:50:04.000Z"),
    updatedAt: new Date("2026-08-26T09:12:08.000Z"),
  },
];
