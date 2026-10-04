"use client";

import { useEffect } from "react";

/* ============================================================
 * VisitTracker — fires one anonymous ping per browser session.
 * The server aggregates per day (Europe/Zurich); no cookies, no
 * IP storage, no fingerprinting.
 * ============================================================ */

const SESSION_KEY = "apg-visit-counted";

export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Private mode: count anyway once per mount.
    }
    const id = setTimeout(() => {
      fetch("/api/visits", { method: "POST" }).catch(() => undefined);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  return null;
}
