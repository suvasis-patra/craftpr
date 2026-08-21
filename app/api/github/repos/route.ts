import { getServerSession } from "@/features/auth/actions";
import { getGithubInstallationIdByUserId } from "@/features/github/server/github-app";
import { getInstallationReposByPage } from "@/features/repos/server/repos";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const installationId = await getGithubInstallationIdByUserId(session.user.id);
  if (!installationId) {
    return NextResponse.json(
      { error: "GitHub App not connected" },
      { status: 400 },
    );
  }
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const data = await getInstallationReposByPage({
    pageNumber: page,
    installationId,
  });
  
  console.log('API Route Response:', {
    page: data.page,
    hasMore: data.hasMore,
    reposCount: data.repos.length,
    totalCount: data.totalCount
  });
  const repoFullNames = data.repos.map((repo) => repo.fullName);
  return NextResponse.json({ ...data });
}
