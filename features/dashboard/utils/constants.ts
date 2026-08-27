import {
  AppWindowIcon,
  Archive,
  Bell,
  GitPullRequest,
  GitPullRequestCreateIcon,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const DASHBOARD_ROUTES = {
  overview: "/dashboard",
  repos: "/dashboard/repos",
  pullRequest: "/dashboard/pull-request",
  github: "/dashboard/github",
  notification: "/dashboard/notification",
  settings: "/dashboard/settings",
} as const;

export type DashboardRoute =
  (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];

export const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: DASHBOARD_ROUTES.overview },
  {
    label: "Repositories",
    icon: Archive,
    href: DASHBOARD_ROUTES.repos,
  },
  {
    label: "Pull Requests",
    icon: GitPullRequest,
    href: DASHBOARD_ROUTES.pullRequest,
  },
  { label: "Github App", icon: AppWindowIcon, href: DASHBOARD_ROUTES.github },
  { label: "Notifications", icon: Bell, href: DASHBOARD_ROUTES.notification },
  { label: "Settings", icon: Settings, href: DASHBOARD_ROUTES.settings },
] as const;

export const DEFAULT_PLAN = "Free";
