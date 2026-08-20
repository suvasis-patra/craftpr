"use server";

import { prisma } from "@/lib/db";
import {
  getGithubApp,
  getGithubInstallationIdByUserId,
} from "../server/github-app";
import { redirect } from "next/navigation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";

export async function deleteGithubAppInstallation({
  userId,
}: {
  userId: string;
}) {
  const githubApp = getGithubApp();
  const installationId = await getGithubInstallationIdByUserId(userId);
  if (!installationId) {
    return;
  }
  // can implement transactional outbox pattern here for consistency
  await githubApp.octokit.request(
    "DELETE /app/installations/{installation_id}",
    { installation_id: installationId },
  );
  await prisma.githubAppInstallation.delete({ where: { userId } });
  redirect(DASHBOARD_ROUTES.github);
}
