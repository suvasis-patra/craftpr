import z from "zod";
import { getPrDetailsById, getPrFiles } from "@/features/pull-requests/actions";
import { getContext } from "@/features/vectordb/server/store";
import { buildPrNamespace } from "@/features/review/server/pr-review";
import { buildRepoNamespace } from "@/features/vectordb/utils";
import { InferUITools, tool, ToolSet, UIDataTypes, UIMessage } from "ai";

export const aiPrChatTools = {
  getPrDetails: tool({
    description:
      "Get detailed information about a specific pull request including title, author, branches, status, files changed, and timestamps",
    inputSchema: z.object({
      prId: z
        .string()
        .describe("The ID of the pull request to fetch details for"),
    }),
    execute: async ({ prId }: { prId: string }) => {
      const prDetails = await getPrDetailsById(prId);
      if (!prDetails) {
        return {
          success: false,
          error: "Pull request not found",
        };
      }
      return {
        success: true,
        data: {
          id: prDetails.id,
          title: prDetails.title,
          prNumber: prDetails.prNumber,
          repoFullName: prDetails.repoFullName,
          authorLogin: prDetails.authorLogin,
          authorAvatarUrl: prDetails.authorAvatarUrl,
          sourceBranch: prDetails.sourceBranch,
          targetBranch: prDetails.targetBranch,
          headSha: prDetails.headSha,
          filesChanged: prDetails.filesChanged,
          prCreatedAt: prDetails.prCreatedAt.toISOString() ?? null,
          prStatus: prDetails.prStatus,
          isDraft: prDetails.isDraft,
          aiReviewStatus: prDetails.aiReviewStatus,
          reviewComment: prDetails.reviewComment,
          reviewedAt: prDetails.reviewedAt?.toISOString() ?? null,
        },
      };
    },
  }),

  getPrFiles: tool({
    description:
      "Get all files that were changed in a pull request with their status, line counts, and diff patches",
    inputSchema: z.object({
      prId: z
        .string()
        .describe("The ID of the pull request to fetch files for"),
    }),
    execute: async ({ prId }: { prId: string }) => {
      const files = await getPrFiles(prId);
      return {
        success: true,
        data: files.map((file) => ({
          id: file.id,
          filePath: file.filePath,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          patch: file.patch,
        })),
      };
    },
  }),

  getFileDiff: tool({
    description:
      "Get the detailed diff/patch content for a specific file in a pull request",
    inputSchema: z.object({
      prId: z.string().describe("The ID of the pull request"),
      filePath: z.string().describe("The path of the file to get the diff for"),
    }),
    execute: async ({ prId, filePath }: { prId: string; filePath: string }) => {
      const files = await getPrFiles(prId);
      const file = files.find((f) => f.filePath === filePath);

      if (!file) {
        return {
          success: false,
          error: "File not found in this pull request",
        };
      }

      return {
        success: true,
        data: {
          filePath: file.filePath,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          patch: file.patch,
        },
      };
    },
  }),

  getAiReview: tool({
    description:
      "Get the AI review analysis and comments for a specific pull request",
    inputSchema: z.object({
      prId: z
        .string()
        .describe("The ID of the pull request to get the AI review for"),
    }),
    execute: async ({ prId }: { prId: string }) => {
      const prDetails = await getPrDetailsById(prId);

      if (!prDetails) {
        return {
          success: false,
          error: "Pull request not found",
        };
      }

      return {
        success: true,
        data: {
          aiReviewStatus: prDetails.aiReviewStatus,
          reviewComment: prDetails.reviewComment,
          reviewedAt: prDetails.reviewedAt?.toISOString() ?? null,
        },
      };
    },
  }),

  buildPrNamespace: tool({
    description:
      "Build the namespace string for a specific pull request's indexed code context. This is used for vector search within PR-specific code.",
    inputSchema: z.object({
      repoFullName: z
        .string()
        .describe("The full repository name in format 'owner/repo'"),
      prNumber: z.number().describe("The pull request number"),
    }),
    execute: async ({
      repoFullName,
      prNumber,
    }: {
      repoFullName: string;
      prNumber: number;
    }) => {
      const namespace = buildPrNamespace({
        repoFullName,
        prNumber,
      });

      return {
        success: true,
        data: {
          namespace,
          format: "repo--owner--pr-number",
        },
      };
    },
  }),

  buildRepoNamespace: tool({
    description:
      "Build the namespace string for a repository's indexed code context. This is used for vector search across the entire repository codebase.",
    inputSchema: z.object({
      repoFullName: z
        .string()
        .describe("The full repository name in format 'owner/repo'"),
    }),
    execute: async ({ repoFullName }: { repoFullName: string }) => {
      const namespace = buildRepoNamespace(repoFullName);

      return {
        success: true,
        data: {
          namespace,
          format: "repo--owner--codebase",
        },
      };
    },
  }),

  repoContext: tool({
    description:
      "Search for relevant code context across the entire repository's indexed codebase using semantic search. Use this for repository-wide questions like 'How is authentication handled in this repo?'",
    inputSchema: z.object({
      repoFullName: z
        .string()
        .describe("The full repository name in format 'owner/repo'"),
      query: z
        .string()
        .describe("The search query to find relevant code context"),
    }),
    execute: async ({
      repoFullName,
      query,
    }: {
      repoFullName: string;
      query: string;
    }) => {
      try {
        const namespace = buildRepoNamespace(repoFullName);
        const context = await getContext({
          namespace,
          query,
        });

        return {
          success: true,
          data: {
            context,
            namespace,
            scope: "repository-wide",
          },
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to search repository context",
        };
      }
    },
  }),

  prContext: tool({
    description:
      "Search for relevant code context within a specific pull request's changed code using semantic search. Use this for PR-specific questions like 'What changed in the authentication logic in this PR?'",
    inputSchema: z.object({
      repoFullName: z
        .string()
        .describe("The full repository name in format 'owner/repo'"),
      prNumber: z.number().describe("The pull request number"),
      query: z
        .string()
        .describe("The search query to find relevant code context"),
    }),
    execute: async ({
      repoFullName,
      prNumber,
      query,
    }: {
      repoFullName: string;
      prNumber: number;
      query: string;
    }) => {
      try {
        const namespace = buildPrNamespace({
          repoFullName,
          prNumber,
        });
        const context = await getContext({
          namespace,
          query,
        });

        return {
          success: true,
          data: {
            context,
            namespace,
            scope: "pr-specific",
          },
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to search PR context",
        };
      }
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof aiPrChatTools>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
