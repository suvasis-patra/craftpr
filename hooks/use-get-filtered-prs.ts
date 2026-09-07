import {
  TPrFilter,
  TPullRequestItem,
} from "@/features/pull-requests/utils/types";
import { useMemo } from "react";

export const useGetFilteredPrs = ({
  prFilter,
  prSearch,
  pullRequest,
}: {
  prFilter: string;
  prSearch: string;
  pullRequest: TPullRequestItem[];
}) => {
  const prs = useMemo(() => {
    const query = prSearch.toLowerCase();
    return pullRequest.filter((pr) => {
      // Handle filter by status and draft
      if (prFilter === "draft") {
        if (!pr.isDraft) return false;
      } else if (prFilter !== "all") {
        // Convert filter to uppercase to match PRStatus enum
        const filterUpperCase = prFilter.toUpperCase();
        if (pr.prStatus !== filterUpperCase) return false;
      }

      // Handle search by title
      if (query && !pr.title.toLowerCase().includes(query)) {
        return false;
      }

      return true;
    });
  }, [prFilter, prSearch, pullRequest]);
  return prs;
};
