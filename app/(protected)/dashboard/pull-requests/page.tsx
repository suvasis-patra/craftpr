import { requiredAuth } from "@/features/auth/actions";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import { getGithubAppInstallationStatus } from "@/features/github/server/github-app";
import PullRequests from "@/features/pull-requests/components/pull-requests";
import { ReposNotConnected } from "@/features/repos/components/repo-not-connected";

const PullRequestsPage = async () => {
  const session = await requiredAuth();
  const installation = await getGithubAppInstallationStatus(session.user.id);
  return (
    <div>
      <DashboardHeader
        title="Pull requests"
        description="Install or disconnect AuditPR from your github account"
      />
      {installation.connected ? <PullRequests /> : <ReposNotConnected />}
    </div>
  );
};

export default PullRequestsPage;
