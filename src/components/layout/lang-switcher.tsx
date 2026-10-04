"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_CODES, routing, type AppLocale } from "@/i18n/routing";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

/**
 * Language switcher (brief §7) — compact dropdown, keyboard friendly.
 * Switching keeps the current pathname (locale prefix swaps).
 */
export function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: AppLocale) => {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("langLabel")}
        className="apg-focus flex min-h-11 items-center gap-1.5 border border-white/25 px-3 font-ui text-sm font-semibold tracking-[0.15em] text-white transition-colors hover:border-apg-yellow hover:text-apg-yellow"
      >
        {LOCALE_CODES[locale]}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("langLabel")}
            initial={{ opacity: 0, y: -6, clipPath: "polygon(0 0,100% 0,100% 0,0 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute right-0 top-full z-10 mt-2 w-28 border border-white/15 bg-ink/95 py-1 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {routing.locales.map((l) => (
              <li key={l} role="option" aria-selected={l === locale}>
                <button
                  type="button"
                  onClick={() => switchTo(l)}
                  lang={l}
                  className={`apg-focus flex w-full min-h-10 items-center justify-between px-3 font-ui text-sm font-semibold tracking-[0.15em] transition-colors ${
                    l === locale
                      ? "bg-white/10 text-apg-yellow"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {LOCALE_CODES[l]}
                  {l === locale && (
                    <span aria-hidden className="inline-block size-1.5 rotate-45 bg-apg-yellow" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
