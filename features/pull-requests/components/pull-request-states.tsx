import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft, RefreshCw } from "lucide-react";
import Image from "next/image";

export function PullRequestLoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-border py-4 px-0">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-8 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-6 w-2/3 rounded mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PullRequestErrorState() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div className="mb-4 p-3 bg-red-500/10 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Failed to load pull requests
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
        Something went wrong while fetching your pull requests. Please try
        again.
      </p>
      <Button onClick={() => window.location.reload()} variant="default">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
}

export function PullRequestEmptyState({
  invalidatePullRequests,
}: {
  invalidatePullRequests: () => void;
}) {
  return (
    <div className="w-full min-h-150 flex flex-col items-center justify-center py-12">
      <div className="mb-8">
        <Image
          src={"/craftpr_pull_request_empty.png"}
          alt="pull_request_empty"
          width={400}
          height={300}
          className="object-contain"
        />
      </div>
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          No pull requests yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          There are no pull requests to display. Try refreshing or start by
          exploring your repositories.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={invalidatePullRequests} variant="default" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="lg">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

export function PullRequestNoResultsState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div className="mb-4">
        <div className="text-6xl">🔍</div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No results found
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
        No pull requests match your current filters or search. Try adjusting
        your criteria.
      </p>
      <Button onClick={onClearFilters} variant="default">
        Clear filters
      </Button>
    </div>
  );
}
