"use client";
import { useState } from "react";
import type { ComponentType } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Loader2,
  MessageSquare,
  Radio,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GithubIcon from "@/components/custom/github-icon";
import { TGithubAppInstallationStatus } from "../utils/types";
import { getGithubAppInstallationUrl } from "../utils/github-app";
import { deleteGithubAppInstallation } from "../actions/github-app";

type Permission = {
  id: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  detail: string;
  granted: boolean;
};

type StatusBadgeProps = {
  connected: boolean;
};

type PermissionRowProps = {
  permission: Permission;
};

type ConnectedDetailsProps = {
  accountLogin: string | null;
};

type GithubConnectionCardProps = {
  userId: string;
  installationStatus: TGithubAppInstallationStatus;
};

const permissions: Permission[] = [
  {
    id: "github-permission-repository-metadata",
    icon: ShieldCheck,
    title: "Repository metadata",
    detail: "Read repository names, branches, and basic details",
    granted: true,
  },
  {
    id: "github-permission-pr-webhooks",
    icon: Radio,
    title: "Pull request webhooks",
    detail: "Receive events for pull request activity",
    granted: true,
  },
  {
    id: "github-permission-review-comments",
    icon: MessageSquare,
    title: "Review comments",
    detail: "Read and publish comments on pull requests",
    granted: true,
  },
];

export const StatusBadge = ({ connected }: StatusBadgeProps) => {
  return (
    <div
      data-testid="github-status-badge"
      aria-label={
        connected ? "GitHub App connected" : "GitHub App not connected"
      }
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
        connected
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
          : "border-orange-400/25 bg-orange-400/10 text-orange-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          connected
            ? "bg-emerald-300 motion-safe:animate-pulse"
            : "bg-orange-300"
        }`}
        aria-hidden="true"
      />

      {connected ? "Connected" : "Not connected"}
    </div>
  );
};

export const PermissionRow = ({ permission }: PermissionRowProps) => {
  const Icon = permission.icon;

  return (
    <div
      data-testid={permission.id}
      className="flex items-center gap-3 border-b border-border/60 py-4 last:border-b-0"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/40 text-muted-foreground"
        aria-hidden="true"
      >
        <Icon size={15} strokeWidth={1.7} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-card-foreground">
          {permission.title}
        </p>

        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {permission.detail}
        </p>
      </div>

      <div
        className={`flex shrink-0 items-center gap-1.5 text-xs ${
          permission.granted ? "text-emerald-300" : "text-muted-foreground"
        }`}
        data-testid={`${permission.id}-state`}
      >
        {permission.granted ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <span>Not granted</span>
        )}

        {permission.granted && <span className="sr-only">Granted</span>}
      </div>
    </div>
  );
};

const ConnectedDetails = ({ accountLogin }: ConnectedDetailsProps) => {
  return (
    <div
      data-testid="github-account-scope"
      className="mt-6 flex items-center justify-between gap-4 border border-emerald-400/20 bg-emerald-400/6 px-4 py-3"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
          Installation scope
        </p>

        <p className="mt-1 text-sm font-medium text-emerald-100">
          {accountLogin ? `@${accountLogin}` : "Scope unknown"}
        </p>
      </div>

      <span className="text-xs text-emerald-300/80">Active</span>
    </div>
  );
};

const DisconnectedDetails = () => {
  return (
    <div
      data-testid="github-disconnected-details"
      className="mt-6 flex items-start gap-3 border border-orange-400/20 bg-orange-400/6 px-4 py-3"
    >
      <AlertCircle
        size={16}
        className="mt-0.5 shrink-0 text-orange-300"
        aria-hidden="true"
      />

      <p className="text-xs leading-relaxed text-orange-100/80">
        Install the GitHub App to enable pull request reviews and webhook
        delivery.
      </p>
    </div>
  );
};

export default function GithubConnectionCard({
  userId,
  installationStatus,
}: GithubConnectionCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { connected, accountLogin } = installationStatus;
  const installUrl = getGithubAppInstallationUrl(userId);
  const handleDisconnect = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();

    setPending(true);
    setError("");

    try {
      setOpen(false);
      await deleteGithubAppInstallation({ userId });
    } catch (disconnectError: unknown) {
      if (disconnectError instanceof Error) {
        setError(disconnectError.message);
      } else {
        setError("Disconnect failed. Try again.");
      }
    } finally {
      setPending(false);
    }
  };
  if (pending) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section
      data-testid="github-connection-card"
      className="w-full max-w-3xl m-6 rounded-lg border border-border/70 bg-card p-6 text-card-foreground shadow-none motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-card-foreground"
            aria-hidden="true"
          >
            <GithubIcon />
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Integration
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              GitHub App
            </h2>

            <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
              Connect your repositories to power automated pull request reviews.
            </p>
          </div>
        </div>

        <StatusBadge connected={connected} />
      </div>

      {connected ? (
        <ConnectedDetails accountLogin={accountLogin} />
      ) : (
        <DisconnectedDetails />
      )}

      <div className="mt-7">
        <div className="mb-1 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Granted permissions
          </p>

          <span className="text-[11px] text-muted-foreground/70">
            Read-only summary
          </span>
        </div>

        <div
          data-testid="github-permission-summary"
          className="grid grid-cols-1"
        >
          {permissions.map((permission) => (
            <PermissionRow key={permission.id} permission={permission} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {connected
            ? "Manage this installation from your workspace."
            : "Takes less than a minute to set up."}
        </p>

        {connected ? (
          <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}
          >
            <AlertDialogTrigger
              render={
                <Button
                  data-testid="github-disconnect-trigger"
                  variant="outline"
                  className="border-red-400/40 text-red-300 hover:bg-red-400/10 hover:text-red-200"
                >
                  Disconnect
                </Button>
              }
            ></AlertDialogTrigger>

            <AlertDialogContent className="border-border bg-popover text-popover-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect GitHub App?</AlertDialogTitle>

                <AlertDialogDescription>
                  This revokes the installation and stops webhook delivery and
                  pull request review behavior for this workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {error && (
                <div
                  data-testid="github-disconnect-error"
                  role="alert"
                  className="flex items-center gap-2 border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200"
                >
                  <AlertCircle size={15} aria-hidden="true" />
                  {error}
                </div>
              )}

              {pending && (
                <p
                  data-testid="github-disconnect-pending"
                  aria-live="polite"
                  className="text-xs text-muted-foreground"
                >
                  Disconnecting…
                </p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel
                  data-testid="github-disconnect-cancel"
                  disabled={pending}
                >
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  data-testid="github-disconnect-confirm"
                  disabled={pending}
                  onClick={handleDisconnect}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  {pending && (
                    <Loader2
                      size={15}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {pending ? "Disconnecting…" : "Disconnect App"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            data-testid="github-install-link"
            nativeButton={false}
            render={<a href={installUrl} />}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Install GitHub App
            <ChevronRight size={15} aria-hidden="true" />
          </Button>
        )}
      </div>
    </section>
  );
}
