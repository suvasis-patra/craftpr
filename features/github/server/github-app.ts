import { App } from "octokit";
import { prisma } from "@/lib/db";
import { getAccountLogin } from "../utils/github-app";

let githubApp: App | null = null;

export function getGithubApp() {
  if (!githubApp) {
    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_SECRET_KEY!,
      webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! },
    });
  }
  return githubApp;
}

export async function getGithubInstallationIdByUserId(userId: string) {
  const installation = await prisma.githubAppInstallation.findFirst({
    where: { userId },
    select: { installationId: true },
  });
  if (!installation) {
    return null;
  }

  return installation.installationId;
}

export async function getUserIdByGithubInstallationId(installationId: number) {
  const installation = await prisma.githubAppInstallation.findFirst({
    where: { installationId },
    select: { userId: true },
  });
  if (!installation) {
    return null;
  }
  return installation.userId;
}

export async function getGithubAppInstallationStatus(userId: string) {
  const installation = await prisma.githubAppInstallation.findUnique({
    where: { userId },
  });
  if (!installation) {
    return { connected: false, accountLogin: null, completedAt: null };
  }
  return {
    connected: true,
    accountLogin: installation.accountLogin,
    comletedAt: installation.createdAt.toISOString(),
  };
}

export async function saveGithubAppInstallation({
  installationId,
  userId,
}: {
  installationId: number;
  userId: string;
}) {
  const githubApp = getGithubApp();
  const { data } = await githubApp.octokit.request(
    "GET /app/installations/{installation_id}",
    { installation_id: installationId },
  );
  const accountLogin = getAccountLogin(data.account);
  await prisma.githubAppInstallation.upsert({
    where: { userId },
    create: {
      userId,
      installationId,
      accountLogin,
      accountType: data.target_type ?? null,
    },
    update: {
      installationId,
      accountLogin,
      accountType: data.target_type ?? null,
    },
  });
}
