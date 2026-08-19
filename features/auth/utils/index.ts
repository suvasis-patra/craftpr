import { AUTH_ROUTES, DEFAULT_CALLBACK_URL, PUBLIC_ROUTES } from "./constant";

export function getSafeCallbackPath(path: string | null | undefined): string {
  if (path?.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return DEFAULT_CALLBACK_URL;
}

export function isAuthRoute(pathName:string){
  return AUTH_ROUTES.includes(pathName)
};
export function isPublicRoute(pathName:string){
  return PUBLIC_ROUTES.includes(pathName)
};