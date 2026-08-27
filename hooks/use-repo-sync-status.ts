import { TRepoSyncEvent } from "@/features/repo-sync/utils/type";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";
import { formatDateFromTimestamps } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TRepoSyncStatus } from "@/features/repos/utils/types";

export const useRepoSyncStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatuses, setSyncStatuses] = useState<Map<string, TRepoSyncStatus>>(new Map());

  useEffect(() => {
    const eventSource = new EventSource("/api/sync-updates");
    eventSource.onopen = () => setIsConnected(true);
    eventSource.onmessage = (event) => {
      console.log(event);
      try {
        const data = JSON.parse(event.data) as TRepoSyncEvent;
        
        // Update sync status map
        setSyncStatuses((prev) => {
          const newStatuses = new Map(prev);
          const syncStatus = convertRepoSyncStatus(data.type);
          if (syncStatus) {
            newStatuses.set(data.repoFullName, syncStatus);
          }
          return newStatuses;
        });
        
        if (data.type === RepoSyncStatus.SYNCED) {
          const syncedAt = formatDateFromTimestamps(data.timestamp);
          toast.success("Repository synced", {
            description: `${data.repoFullName} synced successfully with ${data.chunkCount} chunks on ${syncedAt}.`,
          });
        }
        if (data.type === RepoSyncStatus.FAILED) {
          const failedAt = formatDateFromTimestamps(data.timestamp);
          toast.error("Repository sync failed", {
            description: `${data.repoFullName} failed to sync on ${failedAt}. ${
              data.error ?? ""
            }`,
          });
        }
      } catch (error) {}
    };
    eventSource.onerror = (e) => {
      console.error("error connecting to SSE", e);
    };
    return () => eventSource.close();
  }, []);

  // Helper function to get sync status for a specific repo
  const getSyncStatus = (repoFullName: string): TRepoSyncStatus | null => {
    return syncStatuses.get(repoFullName) || null;
  };

  return { isConnected, getSyncStatus };
};

// Helper function to convert RepoSyncStatus enum to TRepoSyncStatus
function convertRepoSyncStatus(status: RepoSyncStatus): TRepoSyncStatus | null {
  switch (status) {
    case RepoSyncStatus.PENDING:
      return "pending";
    case RepoSyncStatus.SYNCING:
      return "syncing";
    case RepoSyncStatus.SYNCED:
      return "synced";
    case RepoSyncStatus.FAILED:
      return "failed";
    default:
      return null;
  }
}
