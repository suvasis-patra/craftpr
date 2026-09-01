import { reviewPullRequestFunction } from "@/features/inngest/functions/pr-review";
import { syncRepoCodebaseFunction } from "@/features/inngest/functions/sync-repo";
import { inngest } from "@/features/inngest/utils/client";
import { processTask } from "@/features/inngest/utils/function";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask, syncRepoCodebaseFunction, reviewPullRequestFunction],
});
