"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NAV_ITEMS } from "../utils/constants";
import { usePathname } from "next/navigation";
import { isActiveNavItem } from "../utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DashboardNavbar = () => {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActiveNavItem(pathname, item.href);
            return (
              <SidebarMenuItem
                key={item.href}
                className={cn("my-1", active ? "border-l border-chart-2" : "")}
              >
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.label}
                  render={
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default DashboardNavbar;
