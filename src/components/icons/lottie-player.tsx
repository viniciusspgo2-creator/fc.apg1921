"use client";

import { useReducedMotion } from "framer-motion";
import lottie, { type AnimationItem } from "lottie-web";
import { useEffect, useRef } from "react";

/**
 * Lottie player (brief §5/§10) — local JSON files only, no CDN.
 * Reduced motion: renders a single static frame (autoplay off).
 */
export interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  ariaLabel: string;
}

export function LottiePlayer({
  src,
  className,
  loop = true,
  ariaLabel,
}: LottiePlayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    let anim: AnimationItem | undefined;

    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !ref.current) return;
        anim = lottie.loadAnimation({
          container: ref.current,
          renderer: "svg",
          loop,
          autoplay: !reduced,
          animationData: data,
        });
        if (reduced) {
          // Freeze on a representative frame.
          anim.addEventListener("DOMLoaded", () => anim?.goToAndStop(60, true));
        }
      })
      .catch(() => {
        // Asset missing — component simply renders nothing.
      });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, loop, reduced]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      className={className}
    />
  );
}
