import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import DashboardNavbar from "./dashboard-navbar";
import SidebarUserButton from "./sidebar-user-button";
import { TUserDetails } from "../utils/types";

const DashboardSidebar = ({
  user,
  plan,
}: {
  user: TUserDetails;
  plan: string;
}) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="CraftPR"
              render={
                <Link href={"/dashboard"}>
                  <span className="flex size-8 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-none bg-sidebar">
                    <Image
                      src="/craftpr_logo.svg"
                      alt="CraftPR logo"
                      width={62}
                      height={62}
                      className="object-contain"
                    />
                  </span>
                  <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-xl font-semibold">
                      Craft<span className="text-chart-4">PR</span>
                    </span>
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavbar />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
