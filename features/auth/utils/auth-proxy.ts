import { NextRequest, NextResponse } from "next/server";
import {
  getSafeCallbackPath,
  isAuthRoute,
  isPublicRoute,
} from "@/features/auth/utils";
import {
  AUTH_PATHS,
  DEFAULT_CALLBACK_URL,
  GITHUB_CALLBACK_URL,
} from "@/features/auth/utils/constant";
import { getServerSession } from "../actions";

function getPostAuthRedirectPath(request: NextRequest): string {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
  return getSafeCallbackPath(callbackUrl);
}

function redirectToSignIn(request: NextRequest, pathname: string) {
  const signInUrl = new URL(AUTH_PATHS.signIn, request.url);
  const targetPath =
    pathname === AUTH_PATHS.signIn ? DEFAULT_CALLBACK_URL : pathname;
  const targetSearch = targetPath === pathname ? request.nextUrl.search : "";

  signInUrl.searchParams.set("callbackUrl", `${targetPath}${targetSearch}`);
  return NextResponse.redirect(signInUrl);
}

export const handleAuthProxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const session = await getServerSession(new Headers(request.headers));

  if (!session && !isPublicRoute(pathname) && !isAuthRoute(pathname)) {
    return redirectToSignIn(request, pathname);
  }

  if (pathname.startsWith(GITHUB_CALLBACK_URL)) {
    return NextResponse.next();
  }

  if (session && isAuthRoute(pathname)) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.includes("callbackUrl=")) {
      const safeCallback = getSafeCallbackPath(null);
      return NextResponse.redirect(new URL(safeCallback, request.url));
    }
    const redirectTo = getPostAuthRedirectPath(request);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
};
