import { TPullRequestWebhookPayload } from "@/features/github/utils/types";
import { savePrPatches, savePullRequest } from "../actions/pull-request";
import { inngest } from "@/features/inngest/utils/client";
import { INNGEST_EVENTS } from "@/features/inngest/utils/events";
import { getGithubApp } from "@/features/github/server/github-app";
import { TPRFile } from "../utils/types";
import { TCodeChunk } from "@/features/repo-sync/utils/type";
import { PRFileStatus } from "@/lib/generated/prisma/enums";

const MAX_CHUNK_LINES = 80;

function buildChunkId(prNumber: number, filePath: string, part: number) {
  return `pr-${prNumber}--${filePath}--part-${part}`;
}

function mapGitHubStatusToEnum(status: string): PRFileStatus {
  const statusMap: Record<string, PRFileStatus> = {
    added: PRFileStatus.ADDED,
    modified: PRFileStatus.MODIFIED,
    removed: PRFileStatus.DELETED, // GitHub uses "removed" not "deleted"
    renamed: PRFileStatus.RENAMED,
    changed: PRFileStatus.MODIFIED, // Similar to modified
    copied: PRFileStatus.ADDED, // Similar to added
    unchanged: PRFileStatus.MODIFIED, // No change but part of PR
  };
  return statusMap[status] || PRFileStatus.MODIFIED; // Default to MODIFIED if unknown
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
  prId,
}: {
  prNumber: number;
  installationId: number;
  repoFullName: string;
  prId: string;
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
    await savePrPatches({
      pullRequestId: prId,
      patch: file.patch,
      deletions: file.deletions,
      additions: file.additions,
      status: mapGitHubStatusToEnum(file.status),
      filePath: file.filename,
    });
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
