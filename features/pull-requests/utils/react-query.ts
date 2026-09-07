import { infiniteQueryOptions } from "@tanstack/react-query";
import { getPullRequestsAction } from "../actions";

export const pullRequestsInfiniteQuery = infiniteQueryOptions({
  queryKey: ["pull-requests"],
  queryFn: ({ pageParam }: { pageParam?: string }) =>
    getPullRequestsAction({ cursor: pageParam, limit: 10 }),
  initialPageParam: undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: 5 * 60 * 1000, // 5 minutes - prevents refetch unless stale
  gcTime: 10 * 60 * 1000, // 10 minutes - keeps data in cache longer
});
