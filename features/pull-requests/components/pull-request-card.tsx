import { CircleUserRound, FileCodeCorner } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { TPullRequestItem } from "../utils/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PullRequestCard = ({
  isLast,
  prDetails,
}: {
  prDetails: TPullRequestItem;
  isLast: boolean;
}) => {
  const {
    authorAvatarUrl,
    authorLogin,
    filesChanged,
    prNumber,
    sourceBranch,
    prCreatedAt,
    title,
    id,
  } = prDetails;

  return (
    <Link href={`/dashboard/pull-requests/${id}`}>
      <div
        className={cn(
          "w-full p-5 transition-all duration-200 border border-[#3c3c3c] border-l-4 border-l-orange-500 hover:bg-[#2d2d2d] hover:border-l-orange-400 hover:shadow-md cursor-pointer group",
          !isLast && "border-b-0",
        )}
      >
        {/* Header: PR number, repo, branch */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-yellow-600 dark:text-yellow-500 font-semibold">
            #{prNumber < 10 ? `0${prNumber}` : prNumber}
          </span>
          <span className="text-muted-foreground">·</span>
          <Badge variant="secondary" className="text-xs font-normal">
            {sourceBranch}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base mb-3 text-foreground line-clamp-1 hover:text-chart-1 cursor-pointer transition-colors">
          {title}
        </h3>

        {/* Footer: Author, time, files, status */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {authorAvatarUrl ? (
                <Image
                  src={authorAvatarUrl}
                  alt={authorLogin || "avatar"}
                  width={18}
                  height={18}
                  className="rounded-full"
                />
              ) : (
                <CircleUserRound className="text-chart-2" />
              )}
              <span>{authorLogin}</span>
            </div>
            <span>·</span>
            <span>
              {formatDistanceToNow(new Date(prCreatedAt), { addSuffix: false })}{" "}
              ago
            </span>
            <span>·</span>
            <div className="flex items-center gap-1">
              <FileCodeCorner className="h-3.5 w-3.5" />
              <span>{filesChanged} files</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PullRequestCard;
