"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-into-view reveal (§11) — subtle rise + fade, stagger via delay.
 * Reduced motion: content appears without translation.
 */
export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduced ? 0.2 : 0.55,
        delay: reduced ? 0 : delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      {children}
    </Comp>
  );
}
