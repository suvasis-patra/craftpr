import { getGithubApp } from "@/features/github/server/github-app";
import { REPO_PER_PAGE } from "../utils/constant";
import { mapRepo } from "../utils";

export async function getInstallationReposByPage({
  pageNumber = 1,
  installationId,
}: {
  pageNumber: number;
  installationId: number;
}) {
  const app = getGithubApp();
  const octakit = await app.getInstallationOctokit(installationId);
  const { data } = await octakit.request("GET /installation/repositories", {
    per_page: REPO_PER_PAGE,
    page: pageNumber,
  });
  
  console.log(`GitHub API Response - Page ${pageNumber}:`, {
    reposReceived: data.repositories.length,
    totalCount: data.total_count,
    perPage: REPO_PER_PAGE,
  });
  
  const repos = data.repositories.map(mapRepo);
  const totalCount = data.total_count;
  // Calculate hasMore based on actual received repos and total count
  const hasMore = repos.length > 0 && (pageNumber - 1) * REPO_PER_PAGE + repos.length < totalCount;
  
  console.log(`Pagination logic - Page ${pageNumber}:`, {
    reposProcessed: repos.length,
    calculatedHasMore: hasMore,
    calculation: `(pageNumber - 1) * REPO_PER_PAGE + repos.length < totalCount`,
    result: `${(pageNumber - 1) * REPO_PER_PAGE + repos.length} < ${totalCount}`,
  });
  
  return {
    repos,
    totalCount,
    page: pageNumber,
    hasMore,
  };
}
