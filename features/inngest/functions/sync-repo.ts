import {
  markRepoAsSynced,
  markRepoAsSyncing,
  markRepoSyncAsFailed,
} from "@/features/repo-sync/actions/sync";
import { inngest } from "../utils/client";
import { INNGEST_FUNCTION_IDS } from "../utils/constants";
import { INNGEST_EVENTS } from "../utils/events";
import {
  chunkFiles,
  fetchRepoFiles,
} from "@/features/repo-sync/server/repo-sync";
import { buildRepoNamespace } from "@/features/vectordb/utils";
import {
  deleteRepoNamespace,
  storeChunksToVectorStore,
} from "@/features/vectordb/server/store";
import { getRedisInstance } from "@/lib/redis/client";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";

export const syncRepoCodebaseFunction = inngest.createFunction(
  {
    id: INNGEST_FUNCTION_IDS[0],
    triggers: { event: INNGEST_EVENTS[0] },
    onFailure: async ({ event }) => {
      const repoFullName = event.data.event.data.repoFullName;
      const userId = event.data.event.data.userId;
      await markRepoSyncAsFailed(event.data.event.data.repoSyncId);
      const redis = getRedisInstance();
      await redis.publish(
        `sync-status:${userId}`,
        JSON.stringify({
          type: RepoSyncStatus.FAILED,
          repoFullName,
          error: event.data.error.message,
          timestamp: new Date().toISOString(),
        }),
      );
    },
  },
  async ({ event, step }) => {
    const repoSyncId = event.data.repoSyncId;
    const repo = await step.run("mark-repo-sync", async () => {
      return await markRepoAsSyncing(repoSyncId);
    });
    const { installationId, repoFullName, branch } = repo;
    const chunks = await step.run("fetch-and-chunk", async () => {
      const files = await fetchRepoFiles({
        installationId,
        repoFullName,
        branch,
      });
      return chunkFiles(files);
    });
    const namespace = buildRepoNamespace(repo.repoFullName);
    if (repo.syncedAt) {
      await step.run(
        "delete-old-data",
        async () => await deleteRepoNamespace(namespace),
      );
    }
    await step.run("store-data", async () => {
      await storeChunksToVectorStore(chunks, namespace);
    });
    await step.run("mark-repo-as-synced", async () => {
      await markRepoAsSynced({ id: repo.id, chunkCount: chunks.length });
      const userId = event.data.userId;
      const redis = getRedisInstance();
      const subscriberCount = await redis.publish(
        `sync-status:${userId}`,
        JSON.stringify({
          type: RepoSyncStatus.SYNCED,
          repoFullName,
          chunkCount: chunks.length,
          timestamp: new Date().toISOString(),
        }),
      );

      console.log(
        "[REDIS] Published successfully. Subscribers:",
        subscriberCount,
      );
    });
    return {
      repoSyncId,
      status: "synced",
      chunkCount: chunks.length,
    };
  },
);
