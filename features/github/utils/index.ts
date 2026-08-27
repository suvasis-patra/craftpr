import { getGithubApp } from "../server/github-app";

export async function isGithubWebhookSignatureValid({
  payload,
  signature,
}: {
  payload: string;
  signature: string | null;
}) {
  if (!signature) {
    return false;
  }
  const app = getGithubApp();
  return await app.webhooks.verify(payload, signature);
}
