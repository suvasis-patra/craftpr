import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/features/dashboard/utils/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrNotFound() {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Pull request not found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This pull request may have been deleted or you don't have access to
          it.
        </p>
        <Link href={DASHBOARD_ROUTES.overview}>
          <Button>
            <ChevronLeft />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
