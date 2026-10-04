"use client";

import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/* ============================================================
 * Hero — photo-led (club banner as background).
 * Desktop keeps the validated left→right scrim; phones switch to a
 * vertical scrim + player-focused crop so the image stays harmonious
 * on narrow screens. No crest overlay, no floating ball.
 * ============================================================ */

const LINE_DUR = 0.6;

export function Hero({
  heroImage,
  nextMatchSlot,
}: {
  heroImage: string;
  nextMatchSlot?: ReactNode;
}) {
  const t = useTranslations();
  const reduced = useReducedMotion();

  const titleLine = (text: string, yellow: boolean, order: number) => (
    <span className="block overflow-hidden">
      <motion.span
        className={`block text-[clamp(2.9rem,8.5vw,7.5rem)] leading-[0.9] ${yellow ? "text-apg-yellow sm:ml-[0.06em]" : "text-white"}`}
        initial={reduced ? { opacity: 0 } : { y: "108%" }}
        animate={reduced ? { opacity: 1 } : { y: "0%" }}
        transition={{
          duration: LINE_DUR,
          delay: reduced ? 0 : 0.1 + order * 0.09,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section
      className="relative flex min-h-[92svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background photo — on phones the crop follows the player
          (the wide banner reads awkwardly with the desktop crop). */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt={t("hero.imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[68%_center]"
        />
        {/* Phones: vertical scrim (top for the header, bottom for the
            scroll cue) so the copy floats on calm ink everywhere. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/35 to-ink/90 lg:hidden"
        />
        {/* Desktop: left→right scrim — dark over the copy, clearing
            toward the photo (validated, unchanged). */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-ink/95 via-ink/60 to-ink/10 lg:block"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"
        />
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-5 pt-28 pb-20 sm:px-8 sm:pt-32 lg:pt-32">
        {/* ---------------------------------------------------- copy */}
        <div className="max-w-2xl">
          <motion.p
            initial={reduced ? undefined : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow"
          >
            <span aria-hidden className="inline-block size-2 rotate-45 bg-apg-yellow" />
            {t("hero.label")}
          </motion.p>

          <h1 id="hero-title" className="mt-4 font-display uppercase tracking-tight drop-shadow-[0_6px_24px_rgba(7,10,18,0.6)]">
            {titleLine(t("hero.titleLine1"), false, 0)}
            {titleLine(t("hero.titleLine2"), true, 1)}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.4, duration: 0.5 }}
          >
            <FlagStripe className="mt-6 w-40" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AppLink
                href="/sobre"
                data-analytics="hero_club"
                className="apg-focus inline-flex min-h-12 items-center bg-apg-yellow px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
              >
                {t("hero.ctaClub")}
              </AppLink>
              <AppLink
                href="/contato"
                data-analytics="hero_contact"
                className="apg-focus inline-flex min-h-12 items-center border border-white/40 bg-ink/30 px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:border-apg-yellow hover:text-apg-yellow"
              >
                {t("hero.ctaContact")}
              </AppLink>
            </div>

            {nextMatchSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.55, duration: 0.5 }}
                className="mt-9"
              >
                {nextMatchSlot}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-[2] flex flex-col items-center gap-1 pb-7 text-white/60"
      >
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.3em]">
          {t("hero.scroll")}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="apg-bounce size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
