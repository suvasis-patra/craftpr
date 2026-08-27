import { TRepoSyncStatus } from "@/features/repos/utils/types";
import {
  CODE_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  SKIPPED_FOLDERS,
} from "./constants";
import { TTreeEntry } from "./type";

export function isSyncing(
  status: TRepoSyncStatus | null,
  mutationPending: boolean,
) {
  if (mutationPending) {
    return true;
  }

  return status === "pending" || status === "syncing";
}

export function getButtonLabel(
  status: TRepoSyncStatus | null,
  mutationPending: boolean,
) {
  if (isSyncing(status, mutationPending)) {
    return "Syncing…";
  }

  return "Sync";
}

export function hasCodeExtension(path: string) {
  return CODE_EXTENSIONS.some((extension) => path.endsWith(extension));
}

export function isSkippedPath(path: string) {
  return SKIPPED_FOLDERS.some((folder) => path.includes(folder));
}

export function buildChunkId(filePath: string, part: number) {
  return `repo--${filePath}--part-${part}`;
}

export function isIndexableFile(entry: TTreeEntry) {
  if (entry.type !== "blob" || !entry.path || !entry.sha) {
    return false;
  }

  if (entry.size && entry.size > MAX_FILE_SIZE_BYTES) {
    return false;
  }

  if (isSkippedPath(entry.path)) {
    return false;
  }

  return hasCodeExtension(entry.path);
}
