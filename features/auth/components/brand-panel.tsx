"use client";
import { motion } from "framer-motion";
import React from "react";
import ReviewCard from "@/features/auth/components/review-card";
import Marquee from "@/features/auth/components/marque";
import CraftPrLogo from "@/components/custom/craftpr-logo";

const chapters = [
  {
    n: "01",
    title: "Ingest the diff",
    body: "Hooks into every pull request the moment it opens.",
  },
  {
    n: "02",
    title: "Reason about intent",
    body: "Reads context, not just lines — flags what humans miss.",
  },
  {
    n: "03",
    title: "Comment like a teammate",
    body: "Inline suggestions you apply with one click.",
  },
];

const RevealLine = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) => (
  <span className="block overflow-hidden">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export default function BrandPanel() {
  return (
    <section
      data-testid="brand-panel"
      className="relative flex min-h-[70vh] flex-col justify-between overflow-hidden bg-ink text-primary-foreground lg:min-h-screen"
    >
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.05]" />

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2" data-testid="brand-logo">
          <span className="flex h-8 w-8 items-center justify-center">
            <CraftPrLogo />
          </span>
          <span className="font-sans text-lg font-semibold tracking-tight text-white">
            CraftPR
          </span>
        </div>
        <p
          data-testid="brand-status"
          className="hidden text-[11px] uppercase tracking-[0.2em] text-white/40 sm:block"
        >
          sys.online — 12,438 repos
        </p>
      </header>

      <div className="relative z-10 px-6 py-14 lg:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="mb-6 text-[11px] uppercase tracking-[0.3em] text-chart-3"
          data-testid="brand-eyebrow"
        >
          Review engine — v1.0
        </motion.p>
        <h1
          data-testid="brand-headline"
          className="max-w-xl font-sans text-4xl text-white font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          <RevealLine delay={0.1}>Every pull request,</RevealLine>
          <RevealLine delay={0.22}>reviewed line by line</RevealLine>
          <RevealLine delay={0.34}>
            <span className="text-chart-3">in seconds.</span>
          </RevealLine>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6 max-w-md text-sm leading-relaxed text-white/50"
          data-testid="brand-subcopy"
        >
          PRism reads your diffs like a staff engineer — security, style, and
          intent — then leaves comments your team actually acts on.
        </motion.p>
      </div>

      <div className="relative z-10 grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
        {chapters.map((c, i) => (
          <motion.div
            key={c.n}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + i * 0.12 }}
            className="border-white/10 px-6 py-5 sm:border-l sm:first:border-l-0 lg:px-8"
            data-testid={`manifesto-chapter-${c.n}`}
          >
            <p className="text-[11px] tracking-[0.25em] text-chart-3">{c.n}</p>
            <p className="mt-2 font-sans text-sm font-medium text-white">
              {c.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">
              {c.body}
            </p>
          </motion.div>
        ))}
      </div>

      <ReviewCard />
      <Marquee />
    </section>
  );
}
