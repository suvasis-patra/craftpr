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
