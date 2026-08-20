import { GITHUB_APP_URL } from "./constants";

export function getGithubAppInstallationUrl(userId: string) {
  const url = new URL(`${GITHUB_APP_URL}/installations/new`);
  url.searchParams.set("state", userId);
  return url.toString();
}

export function getAccountLogin(
  account: { login?: string; slug?: string } | null | undefined,
): string | null {
  if (!account) return null;
  if ("login" in account && account.login) return account.login;
  if ("slug" in account && account.slug) return account.slug;
  return null;
}
