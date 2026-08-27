import { syncRepo } from "@/features/repo-sync/actions/sync";
import { githubRepoKeys } from "@/features/repos/utils/react-query";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSyncRepo = ({
  repoFullName,
  branch,
}: {
  repoFullName: string;
  branch: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await syncRepo({ repoFullName, branch }),
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
      if (status === RepoSyncStatus.SYNCED) {
        toast.info("Repository is already up to date", {
          description: `${repoFullName} is already synced with GitHub.`,
        });
      }
      if (status === RepoSyncStatus.SYNCING) {
        toast.info("Sync already in progress", {
          description: `${repoFullName} is currently syncing. You'll be notified when it's complete.`,
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to sync repository", {
        description: `${repoFullName} could not be synced. ${error.message}`,
      });
    },
  });
};
