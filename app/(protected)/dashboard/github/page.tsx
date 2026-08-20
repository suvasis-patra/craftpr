import { getServerSession } from "@/features/auth/actions";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import GithubConnectionCard from "@/features/github/components/github-connection-card";
import { getGithubAppInstallationStatus } from "@/features/github/server/github-app";

const GithubAppPage = async () => {
  const session = await getServerSession();
  const installationStatus = await getGithubAppInstallationStatus(
    session?.user.id!,
  );
  return (
    <div>
      <DashboardHeader
        title="Github App"
        description="Install or disconnect CraftPR from your github account"
      />
      <GithubConnectionCard
        userId={session?.user.id as string}
        installationStatus={installationStatus}
      />
    </div>
  );
};

export default GithubAppPage;
