import { getServerSession } from "@/features/auth/actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { saveGithubAppInstallation } from "@/features/github/server/github-app";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export function buildSigninRedirectUrl(installationId: string | null) {
  if (installationId) {
    return `/api/github/callback?installation_id=${installationId}`;
  }
  return DASHBOARD_ROUTES.github;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const installationId = searchParams.get("installation_id");
  const session = await getServerSession();

  if (!session) {
    const callbackUrl = buildSigninRedirectUrl(installationId);
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  if (installationId) {
    await saveGithubAppInstallation({
      installationId: Number(installationId),
      userId: session.user.id,
    });
  }
  redirect(DASHBOARD_ROUTES.github);
}
