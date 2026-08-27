import { getGithubApp } from "@/features/github/server/github-app";
import { inngest } from "@/features/inngest/utils/client";
import { INNGEST_EVENTS } from "@/features/inngest/utils/events";
import { prisma } from "@/lib/db";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";
import { buildChunkId, isIndexableFile } from "../utils";
import { MAX_CHUNK_LINES, MAX_FILES } from "../utils/constants";
import { TCodeChunk, TRepoFile } from "../utils/type";
import { getServerSession } from "@/features/auth/actions";

export async function triggerRepoSync({
  installationId,
  repoFullName,
  branch,
}: {
  installationId: number;
  repoFullName: string;
  branch: string;
}) {
  const session = await getServerSession();
  const sync = await prisma.repoSync.upsert({
    where: { repoFullName },
    create: {
      installationId,
      repoFullName,
      branch,
      status: RepoSyncStatus.PENDING,
    },
    update: { installationId, branch, status: RepoSyncStatus.PENDING },
  });
  await inngest.send({
    name: INNGEST_EVENTS[0],
    data: {
      repoSyncId: sync.id,
      repoFullName,
      userId: session?.user.id as string,
    },
  });
  return RepoSyncStatus.PENDING;
}

export async function fetchRepoFiles({
  installationId,
  repoFullName,
  branch,
}: {
  installationId: number;
  repoFullName: string;
  branch: string;
}) {
  const app = getGithubApp();
  const octokit = await app.getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split("/");
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    { owner, repo, recursive: "1", tree_sha: branch },
  );
  const entries = data.tree.filter(isIndexableFile).slice(0, MAX_FILES);
  const files: TRepoFile[] = [];
  for (const entry of entries) {
    const { data: blob } = await octokit.request(
      "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
      { owner, repo, file_sha: entry.sha },
    );
    const content = Buffer.from(blob.content, "base64").toString("utf-8");
    files.push({ filePath: entry.path, content });
  }
  return files;
}

export async function chunkFiles(files: TRepoFile[]) {
  const chunks: TCodeChunk[] = [];
  for (const file of files) {
    const lines = file.content.split("\n");
    for (let start = 0; start < lines.length; start++) {
      const part = start / MAX_CHUNK_LINES;
      const text = lines.splice(start, start + MAX_CHUNK_LINES).join("\n");
      chunks.push({
        id: buildChunkId(file.filePath, part),
        content: text,
        filePath: file.filePath,
      });
    }
  }
  return chunks;
}
