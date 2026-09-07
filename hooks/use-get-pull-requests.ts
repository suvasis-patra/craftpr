import { pullRequestsInfiniteQuery } from "@/features/pull-requests/utils/react-query";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useGetPullRequests = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery(pullRequestsInfiniteQuery);
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  };
};

export const useInvalidatePullRequests = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["pull-requests"] });
  }, [queryClient]);
};
