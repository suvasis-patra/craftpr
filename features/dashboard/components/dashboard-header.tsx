import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className={"h-8"}
        style={{ alignSelf: "center" }}
      />
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-sm font-medium">{title}</h1>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
};

export default DashboardHeader;
