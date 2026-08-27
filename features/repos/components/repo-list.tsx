"use client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { githubReposInfiniteQuery } from "../utils/react-query";
import { TDashboardRepo, TRepoSyncStatus } from "../utils/types";
import { LockIcon, LockKeyholeOpenIcon, StarIcon } from "lucide-react";
import RepoSyncingButton from "@/features/repo-sync/components/repo-sync-button";
import { useRepoSyncStatus } from "@/hooks/use-repo-sync-status";
export type TFilter = "all" | "public" | "private";

const RepoList = () => {
  const { getSyncStatus } = useRepoSyncStatus();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TFilter>("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery(githubReposInfiniteQuery);
  const loading = isPending && !data;
  const repos = useMemo(() => {
    if (!data) {
      return [];
    }

    const loaded = data.pages.flatMap((page) => page.repos);
    // Remove duplicates based on id
    const uniqueRepos = loaded.filter(
      (repo, index, self) => index === self.findIndex((r) => r.id === repo.id),
    );
    return [...uniqueRepos].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [data]);
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const counts = {
    all: repos.length,
    public: repos.filter((repo) => repo.visibility === "public").length,
    private: repos.filter((repo) => repo.visibility === "private").length,
  };
  const visibleRepos = useMemo(() => {
    const query = search.toLowerCase();

    return repos.filter((repo) => {
      if (filter !== "all" && repo.visibility !== filter) {
        return false;
      }

      if (query && !repo.fullName.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });
  }, [repos, filter, search]);
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log("Fetching next page...");
      fetchNextPage();
    } else {
      console.log("Not fetching - conditions not met:", {
        hasNextPage,
        isFetchingNextPage,
      });
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
    footer = "Loading more repositories…";
  } else if (hasNextPage) {
    footer = `Showing ${repos.length} of ${totalCount}`;
  } else if (repos.length > 0) {
    footer = `All ${repos.length} repositories loaded`;
  }
  let rows;

  if (loading) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          Loading repositories…
        </TableCell>
      </TableRow>
    );
  } else if (isError) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          Failed to load repositories.
        </TableCell>
      </TableRow>
    );
  } else if (visibleRepos.length === 0) {
    rows = (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          No repositories found.
        </TableCell>
      </TableRow>
    );
  } else {
    rows = visibleRepos.map((repo, index) => (
      <RepoRow 
        key={`${repo.id}-${index}`} 
        repo={repo} 
        sseSyncStatus={getSyncStatus(repo.fullName)}
      />
    ));
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as TFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="public">Public ({counts.public})</TabsTrigger>
            <TabsTrigger value="private">
              Private ({counts.private})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search repositories…"
          className="max-w-xs"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="rounded-none border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Language</TableHead>
              <TableHead className="text-right">Stars</TableHead>
              <TableHead className="text-right">Updated</TableHead>
              <TableHead className="text-right">Codebase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>
      </div>
      <div
        ref={loadMoreRef}
        className="py-2 text-center text-sm text-muted-foreground"
        style={{ minHeight: "50px" }}
      >
        {footer}
      </div>
    </div>
  );
};

function RepoRow({ repo, sseSyncStatus }: { repo: TDashboardRepo; sseSyncStatus: TRepoSyncStatus | null }) {
  const tone = repo.visibility === "public" ? "info" : "warning";

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{repo.name}</span>
          <span className="text-xs text-muted-foreground">{repo.fullName}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className={""}>
          {repo.visibility === "private" ? (
            <LockIcon className="size-3" />
          ) : (
            <LockKeyholeOpenIcon className="size-3" />
          )}
          {repo.visibility}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {repo.defaultBranch}
      </TableCell>
      <TableCell>{repo.language ?? "—"}</TableCell>
      <TableCell className="text-right">
        <span className="inline-flex items-center justify-end gap-1 text-muted-foreground">
          <StarIcon className="size-3 text-amber-500" />
          {repo.stars}
        </span>
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
      </TableCell>
      <TableCell className="text-right">
        <RepoSyncingButton
          branch={repo.defaultBranch}
          repoFullName={repo.fullName}
          syncStatus={sseSyncStatus ?? repo.syncStatus ?? null}
        />
      </TableCell>
    </TableRow>
  );
}

export default RepoList;
