"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeCallbackPath } from "@/features/auth/utils";

export const handleGithubAuth = async (formData: FormData) => {
  try {
    const callbackUrl = formData.get("callbackUrl");
    const redirectTo = getSafeCallbackPath(
      typeof callbackUrl === "string" ? callbackUrl : null,
    );
    const result = await auth.api.signInSocial({
      body: { provider: "github", callbackURL: redirectTo },
      headers: await headers(),
    });

    if (result.url) {
      redirect(result.url);
    }
  } catch (error) {
    const redirectError = error as Error & { digest?: string };
    if (redirectError.digest?.startsWith("NEXT_REDIRECT")) {
      throw redirectError;
    }

    console.error("failed to login with github", error);
  }
};

export async function getServerSession(reqHeaders?: Headers) {
  return auth.api.getSession({
    headers: reqHeaders || (await headers()),
  });
}