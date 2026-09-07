import { PRFileStatus } from "@/lib/generated/prisma/enums";

export type TPRFile = { path: string; patch: string };

export type TPrPatch = {
  pullRequestId: string;
  filePath: string;
  patch: string;
  status: PRFileStatus;
  additions?: number;
  deletions?: number;
};
