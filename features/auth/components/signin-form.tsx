"use client";

import GithubIcon from "@/components/custom/github-icon";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, GitPullRequest, Loader2 } from "lucide-react";
import { handleGithubAuth } from "@/features/auth/actions";
import { useFormStatus } from "react-dom";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      variants={item}
      disabled={pending}
      type="submit"
      data-testid="github-signin-button"
      className="group mt-10 flex w-full items-center justify-center gap-3 bg-chart-3 px-4 py-3.5 text-sm font-medium text-secondary-foreground transition-colors duration-300 hover:bg-flame"
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <GithubIcon />
          Continue with GitHub
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
}

export default function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <section
      data-testid="signin-panel"
      className="relative flex items-center justify-center bg-foreground px-6 py-16 lg:min-h-screen lg:py-0"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm"
      >
        <motion.div variants={item} className="mb-10 flex items-center gap-4">
          <span
            className="flex items-center gap-2 lg:hidden"
            data-testid="signin-logo-mobile"
          >
            <span className="flex h-7 w-7 items-center justify-center bg-flame text-white">
              <GitPullRequest className="h-3.5 w-3.5" />
            </span>

            <span className="font-sans text-base font-semibold">PRism</span>
          </span>

          <p
            className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
            data-testid="signin-eyebrow"
          >
            Access — 001
          </p>

          <span className="h-px flex-1 bg-border" />

          <p className="text-[11px] text-muted-foreground">v1.0</p>
        </motion.div>

        <motion.h1
          variants={item}
          data-testid="signin-heading"
          className="font-sans text-4xl font-semibold text-background tracking-tight sm:text-5xl"
        >
          Welcome back<span className="text-chart-4">.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 text-sm text-muted-foreground"
        >
          Sign in to keep reviews running on your repos.
        </motion.p>

        <form action={handleGithubAuth}>
          {callbackUrl ? (
            <input type="hidden" value={callbackUrl} name="callbackUrl" />
          ) : null}
          <SubmitButton />
        </form>

        <motion.p
          variants={item}
          className="mt-10 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70"
        >
          SOC2 · SSO on Team plan · 99.99% uptime
        </motion.p>
      </motion.div>
    </section>
  );
}
