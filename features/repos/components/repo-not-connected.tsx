import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Install the GitHub App first to see your repositories.
      </p>
      <Button
        nativeButton={false}
        render={<Link href={DASHBOARD_ROUTES.github} />}
        className={"bg-chart-3 text-white hover:bg-chart-4"}
      >
        Go to GitHub App
        <ChevronRight />
      </Button>
    </div>
  );
}
