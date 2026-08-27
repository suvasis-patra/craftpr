import { useSyncRepo } from "@/hooks/use-sync-repo";
import { TSyncRepoButtonProps } from "../utils/type";
import { Button } from "@/components/ui/button";
import { getButtonLabel, isSyncing } from "../utils";
import { Loader2, RefreshCcw, RefreshCw } from "lucide-react";

const RepoSyncingButton = ({
  repoFullName,
  branch,
  syncStatus,
}: TSyncRepoButtonProps) => {
  const { mutateAsync: syncGithubRepo, isPending } = useSyncRepo({
    repoFullName,
    branch,
  });
  const label = getButtonLabel(syncStatus, isPending);
  return (
    <Button
      size={"sm"}
      disabled={isSyncing(syncStatus, isPending)}
      onClick={async () => await syncGithubRepo()}
    >
      {label === "Syncing…" ? (
        <Loader2 className="animate-spin" />
      ) : (
        <RefreshCw />
      )}
      {getButtonLabel(syncStatus, isPending)}
    </Button>
  );
};

export default RepoSyncingButton;
