export const MAX_FILE_SIZE_BYTES = 100_000 as const;
export const MAX_FILES = 200 as const;
export const MAX_CHUNK_LINES = 80 as const;
export const UPSERT_BATCH_SIZE = 90 as const;

export const repoSyncStatus = { 0: "SYNCED", 1: "PENDING", 2: "FAILED" };

export const CODE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".py",
  ".go",
  ".rb",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".c",
  ".h",
  ".cpp",
  ".cs",
  ".php",
  ".sql",
  ".prisma",
  ".css",
  ".md",
  ".yml",
  ".yaml",
] as const;

export const SKIPPED_FOLDERS = [
  "node_modules/",
  "dist/",
  "build/",
  ".next/",
  "generated/",
  "vendor/",
] as const;
