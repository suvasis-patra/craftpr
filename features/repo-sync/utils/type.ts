import { TRepoSyncStatus } from "@/features/repos/utils/types";
import { RepoSyncStatus } from "@/lib/generated/prisma/enums";

export type TSyncRepoButtonProps = {
  repoFullName: string;
  branch: string;
  syncStatus: TRepoSyncStatus | null;
};
export type TTreeEntry = {
  path?: string;
  type?: string;
  sha?: string;
  size?: number;
};

export type TRepoFile = {
  filePath: string;
  content: string;
};

export type TCodeChunk = {
  id: string;
  content: string;
  filePath: string;
};

export type TRepoSyncEvent = {
  type: RepoSyncStatus;
  repoFullName: string;
  timestamp: string;
  message?: string;
  error?: string;
  chunkCount?: number;
};
