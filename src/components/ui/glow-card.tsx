"use client";

import { useIsDesktopPointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useRef, type ReactNode } from "react";

/**
 * GlowCard (§11) — cursor-following radial light + optional tilt (±8°).
 * Pointer updates are written straight to CSS vars / transform (no state
 * re-render), disabled on touch & reduced-motion.
 */
export interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** Enables 3D tilt on fine pointers. */
  tilt?: boolean;
}

export function GlowCard({ children, className, tilt = false }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopPointer();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isDesktop) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty("--mx", `${px}px`);
    el.style.setProperty("--my", `${py}px`);
    if (tilt) {
      const rx = ((py / rect.height) * -2 + 1) * 8;
      const ry = ((px / rect.width) * 2 - 1) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (tilt) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "relative overflow-hidden transition-transform duration-300 ease-out will-change-transform",
        className,
      )}
    >
      {/* Light edge that follows the cursor */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 [background:radial-gradient(480px_circle_at_var(--mx,50%)_var(--my,50%),rgba(248,224,16,0.18),transparent_65%)] hover:opacity-100 group-hover:opacity-100"
      />
      {children}
    </div>
  );
}
