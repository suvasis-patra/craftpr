import { App } from "octokit";

let githubApp: App | null = null;

export async function getGithubAppInstallationUrl(userId: string) {
  const url = new URL(`${process.env.GITHUB_APP_PUBLIC_URL}/installations/new`);
  url.searchParams.set("state", userId);
  return url.toString();
}

export async function getGithubApp() {
  if (!githubApp) {
    githubApp = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_SECRET_KEY!,
      webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! },
    });
  }
  return githubApp;
}
