"use client";

import { AppLink } from "@/components/layout/transition-link";
import { FlagStripe } from "@/components/brand/flag-stripe";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* ============================================================
 * Lightweight cookie notice (brief §13 — Swiss nLPD).
 * The site sets NO tracking cookies; this banner only records
 * the visitor's acknowledgement in localStorage.
 * ============================================================ */

const KEY = "apg-cookie-choice";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const reduced = useReducedMotion();
  const t = useTranslations("cookies");

  useEffect(() => {
    let chosen = false;
    try {
      chosen = window.localStorage.getItem(KEY) !== null;
    } catch {
      chosen = false;
    }
    if (chosen) return;
    const id = setTimeout(() => setShow(true), reduced ? 200 : 1400);
    return () => clearTimeout(id);
  }, [reduced]);

  const choose = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      // Storage unavailable — just hide the banner.
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="apg-cookies"
          role="region"
          aria-label={t("text")}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="apg-glass fixed bottom-4 left-4 right-4 z-[105] mx-auto max-w-xl p-4 sm:p-5"
        >
          <FlagStripe className="absolute top-0 left-0 right-0" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-snug text-white/75">{t("text")}</p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="apg-focus min-h-11 border border-white/25 px-4 font-ui text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white"
              >
                {t("decline")}
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="apg-focus min-h-11 bg-apg-yellow px-4 font-ui text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-white"
              >
                {t("accept")}
              </button>
              <AppLink
                href="/confidentialite"
                className="apg-focus hidden min-h-11 items-center px-2 font-ui text-xs font-semibold uppercase tracking-[0.15em] text-white/50 underline decoration-apg-yellow underline-offset-4 transition-colors hover:text-apg-yellow sm:inline-flex"
              >
                {t("policy")}
              </AppLink>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
