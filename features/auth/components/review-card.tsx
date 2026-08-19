"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GitPullRequest, ShieldAlert, ThumbsUp } from "lucide-react";

export default function ReviewCard(): React.JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 16,
  });

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 16,
  });

  const onMove = (event: MouseEvent<HTMLDivElement>): void => {
    const element = ref.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    mx.set((event.clientX - rect.left) / rect.width - 0.5);

    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="hidden lg:absolute lg:right-10 lg:top-[27%] lg:block xl:right-16"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-85 rotate-2 border border-white/15 bg-white/6 shadow-2xl shadow-black/60 backdrop-blur-xl"
        data-testid="review-comment-card"
      >
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <span className="flex h-6 w-6 items-center justify-center bg-flame text-white">
            <GitPullRequest className="h-3.5 w-3.5" />
          </span>

          <span className="text-xs text-white/90">prism-bot</span>

          <span className="border border-flame/60 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-flame">
            Review
          </span>

          <span className="ml-auto text-[10px] text-white/35">2m ago</span>
        </div>

        <div className="px-4 py-3">
          <p className="text-[10px] tracking-wide text-white/40">
            src/auth/session.ts · L42
          </p>

          <p className="mt-2 font-sans text-[13px] leading-relaxed text-white/85">
            This token comparison is open to timing attacks. Use a constant-time
            compare before the session is trusted.
          </p>

          <div className="mt-3 border border-white/10 bg-black/40 px-3 py-2 text-[11px] leading-relaxed">
            <p className="text-red-400/80">- if (token === storedToken)</p>

            <p className="text-emerald-400/90">
              + if (crypto.timingSafeEqual(a, b))
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-flame">
            <ShieldAlert className="h-3 w-3" />
            Security
          </span>

          <span className="text-[10px] text-white/40">confidence 98%</span>

          <ThumbsUp
            className="h-3.5 w-3.5 cursor-pointer text-white/40 transition-colors hover:text-flame"
            data-testid="review-card-upvote"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
