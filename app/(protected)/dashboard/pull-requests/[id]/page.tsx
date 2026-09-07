import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { getPrDetailsById, getPrFiles } from "@/features/pull-requests/actions";
import PrNotFound from "@/features/pull-requests/components/pr-not-found";
import FileChangesList from "@/features/pull-requests/components/file-changes-list";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  CircleUserRound,
  CodeXml,
  FileCodeCorner,
  MessageSquareMore,
  PencilSparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AiReviewMessage from "@/features/pull-requests/components/ai-review";
import Chat from "@/features/pull-requests/components/ai-chat";

interface PrDetailsPageProps {
  params: Promise<{ id: string }>;
}
const PRDetailsPage = async ({ params }: PrDetailsPageProps) => {
  const { id } = await params;
  const prDetails = await getPrDetailsById(id);
  if (!prDetails) {
    return <PrNotFound />;
  }
  const {
    repoFullName,
    title,
    prCreatedAt,
    prNumber,
    sourceBranch,
    authorLogin,
    authorAvatarUrl,
    reviewComment,
    aiReviewStatus,
    reviewedAt,
  } = prDetails;

  const prFiles = await getPrFiles(id);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <DashboardHeader
        title="Pull requests"
        description="Install or disconnect AuditPR from your github account"
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Navigation */}

        {/* Main Card */}
        <div className="bg-card border border-border shadow-sm overflow-hidden">
          {/* PR Header Section */}
          <div className="p-6 md:p-8 border-b border-border">
            {/* PR Number and Repo Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2 bg-linear-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
                    #{prNumber < 10 ? `0${prNumber}` : prNumber}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-muted/50 border-border/50"
                >
                  {repoFullName}
                </Badge>
              </div>
              <Link
                href={DASHBOARD_ROUTES.overview}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to dashboard</span>
              </Link>
            </div>

            {/* PR Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {title}
            </h1>

            {/* PR Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Author Info */}
              <div className="flex items-center gap-2.5 bg-muted/30 rounded-full px-4 py-2">
                {authorAvatarUrl ? (
                  <Image
                    src={authorAvatarUrl}
                    alt={authorLogin || "avatar"}
                    width={24}
                    height={24}
                    className="rounded-full ring-2 ring-border"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-chart-2 to-chart-3 flex items-center justify-center">
                    <CircleUserRound className="text-white size-4" />
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">opened by</span>
                  <span className="font-semibold text-foreground">
                    {authorLogin}
                  </span>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>
                  {formatDistanceToNow(new Date(prCreatedAt), {
                    addSuffix: false,
                  })}{" "}
                  ago
                </span>
              </div>

              {/* Branch Info */}
              <div className="flex items-center gap-1.5 bg-linear-to-r from-chart-1/10 to-chart-2/10 border border-chart-1/20 rounded-full px-3 py-1.5">
                <FileCodeCorner className="h-4 w-4 text-chart-1" />
                <span className="text-chart-1 font-medium">{sourceBranch}</span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-muted/30 border-b border-border">
            <Tabs defaultValue="all">
              <TabsList
                variant="line"
                className="w-full justify-start bg-transparent h-12 px-6"
              >
                <TabsTrigger
                  value="all"
                  className="gap-2 data-active:text-foreground data-active:border-b-2 data-active:border-chart-1"
                >
                  <CodeXml className="size-4" />
                  <span>File changes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="public"
                  className="gap-2 data-active:text-foreground data-active:border-b-2 data-active:border-chart-2"
                >
                  <PencilSparkles className="size-4" />
                  <span>AI Review</span>
                </TabsTrigger>
                <TabsTrigger
                  value="private"
                  className="gap-2 data-active:text-foreground data-active:border-b-2 data-active:border-chart-3"
                >
                  <MessageSquareMore className="size-4" />
                  <span>Chat With PR</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="all" className="p-6 md:p-8">
                <FileChangesList files={prFiles} />
              </TabsContent>

              <TabsContent value="public" className="p-0">
                <AiReviewMessage
                  reviewComment={reviewComment}
                  reviewStatus={aiReviewStatus}
                  reviewedAt={reviewedAt}
                />
              </TabsContent>

              <TabsContent value="private" className="p-6 md:p-8">
                <Chat
                  prId={id}
                  repoFullName={repoFullName}
                  prNumber={prNumber}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDetailsPage;
