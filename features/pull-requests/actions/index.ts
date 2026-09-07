"use server";

import { prisma } from "@/lib/db";

export interface FetchPRsParams {
  cursor?: string;
  limit?: number;
}

export async function getPullRequestsAction({
  cursor,
  limit = 10,
}: FetchPRsParams) {
  const items = await prisma.pullRequest.findMany({
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextCursor: string | undefined = undefined;

  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem?.id;
  }

  return {
    items,
    nextCursor,
  };
}

export async function getPrDetailsById(id: string) {
  return await prisma.pullRequest.findUnique({ where: { id } });
}

export async function getPrFiles(prId: string) {
  return await prisma.pRFile.findMany({
    where: { pullRequestId: prId },
    orderBy: { filePath: 'asc' }
  });
}
