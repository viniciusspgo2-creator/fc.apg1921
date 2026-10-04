"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook (brief §13: mobile-first guards).
 * Built on useSyncExternalStore — no setState-in-effect, no
 * hydration mismatch (server snapshot is always `false`).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Desktop pointer guard for hover-only interactions (tilt, cursor ball). */
export const useIsDesktopPointer = () =>
  useMediaQuery("(min-width: 1024px) and (pointer: fine)");

/** Touch guard — 3D ball & particles are reduced on mobile (§9.1). */
export const useIsTouch = () => useMediaQuery("(max-width: 767px)");
