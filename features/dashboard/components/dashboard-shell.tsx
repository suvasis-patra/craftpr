import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";
import { TUserDetails } from "../utils/types";

const DashboardShell = ({
  children,
  plan,
  user,
}: {
  children: React.ReactNode;
  plan: string;
  user: TUserDetails;
}) => {
  return (
    <SidebarProvider>
      <DashboardSidebar user={user} plan={plan} />
      <SidebarInset className="min-h-svh">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardShell;
