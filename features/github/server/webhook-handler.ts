import { NextRequest, NextResponse } from "next/server";
import { isGithubWebhookSignatureValid } from "../utils";
import { TPullRequestWebhookPayload } from "../utils/types";
import {
  getRepoSyncByRepoFullName,
  markRepoSyncAsPending,
} from "@/features/repo-sync/actions/sync";

export async function handleWebhookEvents(request: NextRequest) {
  const payload = await request.text();
  const webhookSignature = request.headers.get("x-hub-signature-256");
  const eventName = request.headers.get("x-github-event");
  const isSignatureValid = await isGithubWebhookSignatureValid({
    payload,
    signature: webhookSignature,
  });
  if (!isSignatureValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
  const jsonPayload = JSON.parse(payload) as TPullRequestWebhookPayload;
  switch (eventName) {
    case "push":
      return handlePushEvent(jsonPayload);

    case "pull_request":
      return handlePullRequestEvent(jsonPayload);

    default:
      return NextResponse.json({ message: `Ignored event: ${eventName}` });
  }
}

export async function handlePushEvent(payload: TPullRequestWebhookPayload) {
  if (
    payload.ref !== "refs/heads/master" &&
    payload.ref !== "refs/heads/main"
  ) {
    return NextResponse.json({ message: `ignored non main branch push` });
  }
  await markRepoSyncAsPending(payload.repository.full_name);
}

export async function handlePullRequestEvent(
  payload: TPullRequestWebhookPayload,
) {
  const action = payload.action;
  switch (action) {
    case "merge":
      await markRepoSyncAsPending(payload.repository.full_name);
  }
}
