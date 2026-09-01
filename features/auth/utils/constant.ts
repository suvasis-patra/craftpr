export const DEFAULT_CALLBACK_URL = "/dashboard";
export const AUTH_PATHS = { signIn: "/sign-in", signUp: "/sign-up" };
export const AUTH_ROUTES = Object.values(AUTH_PATHS);
export const PUBLIC_ROUTES = [
  "/",
  "/api/auth/callback/github",
  "/api/inngest",
  "/api/github/webhook",
  "/api/github/webhook/craftpr",
  "/api/razorpay/webhook",
];
export const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL || "/api/auth/callback";
