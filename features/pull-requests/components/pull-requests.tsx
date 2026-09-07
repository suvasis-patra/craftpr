"use client";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import {
  useGetPullRequests,
  useInvalidatePullRequests,
} from "@/hooks/use-get-pull-requests";
import { useGetFilteredPrs } from "@/hooks/use-get-filtered-prs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PullRequestCard from "./pull-request-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PullRequestEmptyState,
  PullRequestErrorState,
  PullRequestLoadingState,
  PullRequestNoResultsState,
} from "./pull-request-states";
import { TPrFilter } from "../utils/types";
import { Separator } from "@/components/ui/separator";

const PullRequests = () => {
  const [prSearch, setPrSearch] = useState("");
  const [prFilter, setPrFilter] = useState<TPrFilter>("all");
  const invalidatePullRequests = useInvalidatePullRequests();

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const {
    data,
    isError,
    isFetchingNextPage,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useGetPullRequests();
  const isLoading = isPending && !data;
  const pullRequests = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // Filter PRs by status and search
  const filteredPullRequests = useGetFilteredPrs({
    prFilter,
    prSearch,
    pullRequest: pullRequests,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }

    // Disconnect previous observer if exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          console.log("Intersection observed, loading more...");
          handleLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleLoadMore, hasNextPage, isFetchingNextPage]);

  let footer: string | null = null;

  if (isFetchingNextPage) {
    footer = "Loading more pull requests…";
  } else if (hasNextPage) {
    footer = `Showing ${filteredPullRequests.length} pull requests`;
  } else if (filteredPullRequests.length > 0) {
    footer = `All ${filteredPullRequests.length} pull requests loaded`;
  }

  const rows =
    filteredPullRequests.length === 0 ? (
      <div className="mt-3">
        <Separator />
        <p className="w-full text-center mt-4 text-muted-foreground">
          {prFilter === "open"
            ? "There is no open PRs"
            : prFilter === "closed"
              ? "There is no closed PRs"
              : "There is no draft PRs"}
        </p>
      </div>
    ) : (
      filteredPullRequests.map((pr, index) => (
        <PullRequestCard
          key={pr.id}
          prDetails={pr}
          isLast={index === filteredPullRequests.length - 1}
        />
      ))
    );
  return (
    <div className="p-5">
      {isLoading ? (
        <PullRequestLoadingState />
      ) : isError ? (
        <PullRequestErrorState />
      ) : pullRequests.length === 0 ? (
        <PullRequestEmptyState
          invalidatePullRequests={invalidatePullRequests}
        />
      ) : (
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
            <Tabs
              value={prFilter}
              onValueChange={(value) => setPrFilter(value as TPrFilter)}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-6">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      onClick={invalidatePullRequests}
                      disabled={isPending}
                    >
                      <RotateCcw className={isPending ? "animate-spin" : ""} />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search pull requests…"
                  className="pl-10"
                  value={prSearch}
                  onChange={(event) => setPrSearch(event.target.value)}
                />
              </div>
            </div>
          </div>
          {rows}
          <div
            ref={loadMoreRef}
            className="py-2 text-center text-sm text-muted-foreground"
            style={{ minHeight: "50px" }}
          >
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};

export default PullRequests;
