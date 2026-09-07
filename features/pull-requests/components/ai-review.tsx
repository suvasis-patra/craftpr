"use client";

import { PencilSparkles, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIReviewStatus } from "@/lib/generated/prisma/enums";

interface AiReviewMessageProps {
  reviewComment: string | null;
  reviewStatus: AIReviewStatus;
  reviewedAt?: Date | null;
}

const statusConfig = {
  [AIReviewStatus.PENDING]: {
    icon: Clock,
    label: "Pending",
    description: "AI review is waiting to start",
    className: "text-[#d4d4d4]",
    iconClassName: "text-[#858585]"
  },
  [AIReviewStatus.PROCESSING]: {
    icon: Loader2,
    label: "Processing",
    description: "AI is analyzing your pull request",
    className: "text-[#d4d4d4]",
    iconClassName: "text-[#58a6ff] animate-spin"
  },
  [AIReviewStatus.COMPLETE]: {
    icon: CheckCircle,
    label: "Complete",
    description: "AI review completed successfully",
    className: "text-[#2ea043]",
    iconClassName: "text-[#2ea043]"
  },
  [AIReviewStatus.FAILED]: {
    icon: AlertCircle,
    label: "Failed",
    description: "AI review encountered an error",
    className: "text-[#f85149]",
    iconClassName: "text-[#f85149]"
  }
};

const AiReviewMessage = ({
  reviewComment,
  reviewStatus,
  reviewedAt
}: AiReviewMessageProps) => {
  const config = statusConfig[reviewStatus];
  const StatusIcon = config.icon;

  const formatReviewTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex items-center gap-3">
          <StatusIcon className={cn("size-4", config.iconClassName)} />
          <div>
            <p className={cn("text-sm font-medium", config.className)}>
              {config.label}
            </p>
            <p className="text-xs text-[#858585]">
              {config.description}
            </p>
          </div>
        </div>
        {reviewedAt && (
          <div className="text-xs text-[#858585]">
            Reviewed {formatReviewTime(reviewedAt)}
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="px-4 py-4 bg-[#1e1e1e]">
        {reviewStatus === AIReviewStatus.PROCESSING ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 text-[#58a6ff] animate-spin mb-4" />
            <p className="text-sm text-[#d4d4d4]">AI is analyzing your pull request...</p>
            <p className="text-xs text-[#858585] mt-2">This may take a moment</p>
          </div>
        ) : reviewStatus === AIReviewStatus.PENDING ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#3c3c3c] rounded-lg">
            <Clock className="size-12 text-[#858585]/50 mx-auto mb-4" />
            <p className="text-[#858585] text-sm mb-2">
              AI review is pending
            </p>
            <p className="text-xs text-[#6a6a6a]">
              Review will start automatically when pull request is processed
            </p>
          </div>
        ) : reviewStatus === AIReviewStatus.FAILED ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#f8514926] rounded-lg">
            <AlertCircle className="size-12 text-[#f85149]/50 mx-auto mb-4" />
            <p className="text-[#f85149] text-sm mb-2">
              AI review failed
            </p>
            <p className="text-xs text-[#858585]">
              There was an error analyzing this pull request
            </p>
          </div>
        ) : reviewComment ? (
          <div className="space-y-4">
            {/* Review Content */}
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-[#d4d4d4] whitespace-pre-wrap leading-relaxed">
                {reviewComment}
              </div>
            </div>

            {/* Review Metadata */}
            {reviewedAt && (
              <div className="flex items-center gap-2 pt-4 border-t border-[#3c3c3c]">
                <CheckCircle className="size-4 text-[#2ea043]" />
                <span className="text-xs text-[#858585]">
                  Review completed {formatReviewTime(reviewedAt)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#3c3c3c] rounded-lg">
            <PencilSparkles className="size-12 text-[#858585]/50 mx-auto mb-4" />
            <p className="text-[#858585] text-sm mb-2">
              No AI review available
            </p>
            <p className="text-xs text-[#6a6a6a]">
              Review will appear here when processing is complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiReviewMessage;
