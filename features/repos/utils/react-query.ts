import { infiniteQueryOptions } from "@tanstack/react-query";

export const githubRepoKeys = {
  all: ["github", "repos"] as const,
};

const REPOS_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const githubReposInfiniteQuery = infiniteQueryOptions({
  queryKey: [...githubRepoKeys.all, "list"],
  queryFn: async ({ pageParam }) => {
    const response = await fetch(`/api/github/repos?page=${pageParam}`);

    if (!response.ok) {
      throw new Error("Failed to load repositories");
    }

    const data = await response.json();
    console.log('React Query received data:', {
      page: data.page,
      hasMore: data.hasMore,
      reposCount: data.repos?.length,
      totalCount: data.totalCount
    });
    return data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    console.log('getNextPageParam called with:', lastPage);
    if (lastPage.hasMore) {
      const nextPage = (lastPage.page || 0) + 1;
      console.log('Next page calculated:', nextPage);
      return nextPage;
    }
    console.log('No more pages');
    return undefined;
  },
  staleTime: REPOS_STALE_TIME,
});
