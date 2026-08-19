import { DashboardRoute } from "./constants";
import { TUserDetails } from "./types";

export function isActiveNavItem(pathname: string, href: DashboardRoute) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getDisplayName(user: TUserDetails) {
  return user.name?.trim() || user.email?.split("@")[0] || "User";
}
export function getInitials(user: TUserDetails) {
  const source = user.name?.trim() || user.email || "U";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}
