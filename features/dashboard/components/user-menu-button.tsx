"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TUserDetails, TUserMenuTriggerVariant } from "../utils/types";
import { getDisplayName, getInitials } from "../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { DEFAULT_PLAN } from "../utils/constants";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { AUTH_PATHS } from "@/features/auth/utils/constant";

function UserAvatar({
  user,
  size = "default",
}: {
  user: TUserDetails;
  size?: "default" | "sm" | "lg";
}) {
  return (
    <Avatar size={size}>
      {user.image ? (
        <AvatarImage src={user.image} alt={getDisplayName(user)} />
      ) : null}
      <AvatarFallback>{getInitials(user)}</AvatarFallback>
    </Avatar>
  );
}

const UserMenuButton = ({
  plan = DEFAULT_PLAN,
  className,
  variant = "profile",
  user,
}: {
  className: string;
  plan: string;
  user: TUserDetails;
  variant: TUserMenuTriggerVariant;
}) => {
  const displayName = getDisplayName(user);
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push(AUTH_PATHS.signIn) },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(className)}
        render={
          variant === "compact" ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Open account menu"
            />
          ) : (
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2"
              aria-label="Open account menu"
            />
          )
        }
      >
        <UserAvatar
          user={user}
          size={variant === "compact" ? "default" : "sm"}
        />
        {variant === "profile" ? (
          <>
            <span className="max-w-32 truncate text-left text-xs font-medium">
              {displayName}
            </span>
          </>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-start gap-2 px-2 py-2">
              <UserAvatar user={user} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-xs font-medium">{displayName}</p>
                {user.email ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                ) : null}
                <Badge variant="secondary" className="w-fit">
                  {plan} plan
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuButton;
