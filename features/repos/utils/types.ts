export type TRepoSyncStatus = "pending" | "syncing" | "synced" | "failed";

export type TRepoVisibility = "public" | "private";

export type TGithubInstallationStatus = {
  connected: boolean;
  accountLogin: string | null;
  installedAt: string | null;
};

export type TDashboardRepo = {
  id: string;
  name: string;
  fullName: string;
  visibility: TRepoVisibility;
  defaultBranch: string;
  updatedAt: string;
  language: string | null;
  stars: number;
  syncStatus?: TRepoSyncStatus | null;
};

export type TSubscriptionPlan = "free" | "pro";

export type TUserSubscription = {
  plan: TSubscriptionPlan;
  status: "active" | "canceled" | "trialing";
  renewsAt: string | null;
};

export type TGithubRepo = {
  /** GitHub's numeric repo id, stored as a string for consistency with other ids. */
  id: string;
  /** Short repo name without owner, e.g. `my-app`. */
  name: string;
  /** Full name with owner, e.g. `acme/my-app`. */
  fullName: string;
  /** Whether the repo is public or private on GitHub. */
  visibility: "public" | "private";
  /** Default branch GitHub reports (usually `main` or `master`). */
  defaultBranch: string;
  /** ISO timestamp of last activity on the repo. */
  updatedAt: string;
  /** Primary language from GitHub, or null if unknown. */
  language: string | null;
  /** Star count from GitHub's `stargazers_count`. */
  stars: number;
};
