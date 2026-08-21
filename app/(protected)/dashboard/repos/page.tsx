import { Button } from "@/components/ui/button";
import { requiredAuth } from "@/features/auth/actions";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { getGithubAppInstallationStatus } from "@/features/github/server/github-app";
import RepoList from "@/features/repos/components/repo-list";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Install the GitHub App first to see your repositories.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={DASHBOARD_ROUTES.github} />}
        className={"bg-chart-3 text-white hover:bg-chart-4"}
      >
        Go to GitHub App
        <ChevronRight />
      </Button>
    </div>
  );
}

const ConnectedRepos = async () => {
  const session = await requiredAuth();
  const installation = await getGithubAppInstallationStatus(session.user.id);
  return (
    <div>
      <DashboardHeader
        title="Repositories"
        description="All public and private repositories available to the GitHub App."
      />
      {installation.connected ? <RepoList /> : <ReposNotConnected />}
    </div>
  );
};

export default ConnectedRepos;
