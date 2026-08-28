import { TPullRequestWebhookPayload } from "@/features/github/utils/types";
import { savePullRequest } from "../actions/pull-request";
import { inngest } from "@/features/inngest/utils/client";
import { INNGEST_EVENTS } from "@/features/inngest/utils/events";
import { getGithubApp } from "@/features/github/server/github-app";
import { TPRFile } from "../utils/types";
import { TCodeChunk } from "@/features/repo-sync/utils/type";

const MAX_CHUNK_LINES = 80;

function buildChunkId(prNumber: number, filePath: string, part: number) {
  return `pr-${prNumber}--${filePath}--part-${part}`;
}

export async function handlePrReview(payload: TPullRequestWebhookPayload) {
  const pullRequest = await savePullRequest(payload);
  await inngest.send({
    name: INNGEST_EVENTS[1],
    data: { pullRequestId: pullRequest.id },
  });
}

export async function getPullRequestFiles({
  repoFullName,
  prNumber,
  installationId,
}: {
  prNumber: number;
  installationId: number;
  repoFullName: string;
}) {
  const app = getGithubApp();
  const [owner, repo] = repoFullName.split("/");
  const octakit = await app.getInstallationOctokit(installationId);
  const { data } = await octakit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    { owner, repo, pull_number: prNumber },
  );
  const files: TPRFile[] = [];
  for (const file of data) {
    if (!file.patch) {
      continue;
    }
    files.push({ patch: file.patch, path: file.filename });
  }
  return files;
}

export function chunkPrFiles(prNumber: number, files: TPRFile[]): TCodeChunk[] {
  const chunks: TCodeChunk[] = [];

  for (const file of files) {
    const lines = file.patch.split("\n");

    // Slide a fixed-size window across the diff; large files produce many chunks
    for (let start = 0; start < lines.length; start += MAX_CHUNK_LINES) {
      const part = start / MAX_CHUNK_LINES;
      const text = lines.slice(start, start + MAX_CHUNK_LINES).join("\n");

      chunks.push({
        id: buildChunkId(prNumber, file.path, part),
        filePath: file.path,
        content: text,
      });
    }
  }

  return chunks;
}

export function buildPrNamespace({
  repoFullName,
  prNumber,
}: {
  repoFullName: string;
  prNumber: number;
}) {
  return `${repoFullName.replace("/", "--")}--pr-${prNumber}`;
}
