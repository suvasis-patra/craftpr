export type TGithubAppInstallationStatus =
  | {
      connected: boolean;
      accountLogin: null;
      completedAt: null;
      comletedAt?: undefined;
    }
  | {
      connected: boolean;
      accountLogin: string | null;
      comletedAt: string;
      completedAt?: undefined;
    };

export type TPullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  ref: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};
