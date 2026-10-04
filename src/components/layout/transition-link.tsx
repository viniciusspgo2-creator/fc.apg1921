"use client";

import { Link, useRouter } from "@/i18n/navigation";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

/* ============================================================
 * FC APG 1921 — lightweight navigation (2026 redesign).
 * The old ball sweep added ~1.1s of artificial delay to every
 * page change; navigation is now INSTANT. A subtle 250ms fade
 * (PageFade) keeps the premium feel without blocking anything.
 * ============================================================ */

const TransitionCtx = createContext<{ navigate: (href: string) => void }>({
  navigate: () => undefined,
});

/** Programmatic navigation (kept for API compatibility). */
export const useTransitionNavigate = () => useContext(TransitionCtx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      try {
        router.push(href);
      } catch {
        // Never block navigation.
      }
    },
    [router],
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
    </TransitionCtx.Provider>
  );
}

/* ------------------------------------------------------------
 * PageFade — content fades/slides in on route change.
 * 250ms, disabled under prefers-reduced-motion.
 * ------------------------------------------------------------ */

export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------
 * AppLink — locale-aware internal link (immediate navigation).
 * ------------------------------------------------------------ */

type AppLinkProps = React.ComponentProps<typeof Link>;

export function AppLink({ href, onClick, ...rest }: AppLinkProps) {
  return <Link href={href} onClick={onClick} {...rest} />;
}
