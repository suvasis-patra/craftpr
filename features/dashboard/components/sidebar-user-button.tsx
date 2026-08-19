import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import UserMenuButton from "./user-menu-button";
import { TUserDetails } from "../utils/types";

const SidebarUserButton = ({
  user,
  plan,
}: {
  user: TUserDetails;
  plan: string;
}) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenuButton
          user={user}
          plan={plan}
          variant="profile"
          className="w-full [&_button]:h-12 [&_button]:w-full [&_button]:justify-start [&_button]:gap-2 [&_button]:px-2"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUserButton;
