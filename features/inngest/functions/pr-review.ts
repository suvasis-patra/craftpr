import {
  markReviewComplted,
  markReviewProcessing,
} from "@/features/review/actions/pull-request";
import { inngest } from "../utils/client";
import { INNGEST_FUNCTION_IDS } from "../utils/constants";
import { INNGEST_EVENTS } from "../utils/events";
import {
  buildPrNamespace,
  chunkPrFiles,
  getPullRequestFiles,
} from "@/features/review/server/pr-review";
import {
  getContext,
  storeChunksToVectorStore,
} from "@/features/vectordb/server/store";
import { getRepoSyncStatusByRepoFullName } from "@/features/repo-sync/actions/sync";
import { RepoSyncStatus, ReviewStatus } from "@/lib/generated/prisma/enums";
import { buildRepoNamespace } from "@/features/vectordb/utils";
import {
  generateAIReview,
  postAiReviewToGithub,
} from "@/features/ai/server/ai-review";

export const reviewPullRequestFunction = inngest.createFunction(
  { id: INNGEST_FUNCTION_IDS[1], triggers: { event: INNGEST_EVENTS[1] } },
  async ({ step, event }) => {
    const prId = event.data.pullRequestId;
    const { repoFullName, installationId, prNumber, title } = await step.run(
      "mark-review-processing",
      async () => {
        return await markReviewProcessing(prId);
      },
    );
    const chunks = await step.run("chunk-pr-related-files", async () => {
      const files = await getPullRequestFiles({
        repoFullName,
        installationId,
        prNumber,
      });
      return chunkPrFiles(prNumber, files);
    });
    if (chunks.length === 0) {
      await step.run("no-code-to-review", async () => {
        await markReviewComplted(prId);
      });
      return {
        prId,
        status: "reviewed",
        reason: "no code changes found",
      };
    }
    await step.run("save-to-vectordb", async () => {
      const namespace = buildPrNamespace({ repoFullName, prNumber });
      await storeChunksToVectorStore(chunks, namespace);
    });
    await step.sleep("wait-for-vector-to-index", "10s");
    const repoContext = await step.run("get-repo-context", async () => {
      const repo = await getRepoSyncStatusByRepoFullName(repoFullName);
      if (!repo || repo.status !== RepoSyncStatus.SYNCED) {
        return [];
      }
      const repoNamespace = buildRepoNamespace(repoFullName);
      return await getContext({ namespace: repoNamespace, query: title });
    });
    const review = await step.run("generate-ai-review", async () => {
      const namespace = buildPrNamespace({ repoFullName, prNumber });
      const prContext = await getContext({ namespace, query: title });
      const review = await generateAIReview({
        repoContextSnippets: repoContext,
        repoName: repoFullName,
        prTitle: title,
        contextSnippets: prContext,
      });
      return review;
    });
    await step.run("post-ai-review-to-github", async () => {
      await postAiReviewToGithub({
        installationId,
        repoFullName,
        prNumber,
        body: review,
      });
    });
    await step.run("mark-ai-review-complete", async () => {
      await markReviewComplted(prId);
    });
    return { prId, status: ReviewStatus.COMPLETE };
  },
);
