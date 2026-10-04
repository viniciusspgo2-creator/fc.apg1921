"use client";

import { APGLogo } from "@/components/brand/apg-logo";
import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { LottiePlayer } from "@/components/icons/lottie-player";
import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Themed 404 (brief §9.7) — "Hors-jeu !" with the club's recolored
 * Lottie ball. Reduced motion: static crest fallback.
 */
export default function NotFoundPage() {
  const t = useTranslations("notFound");
  const reduced = useReducedMotion();

  return (
    <section className="apg-grain apg-diamonds relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* recolored Lottie ball (Fase 6) — static crest under reduced motion */}
      <div aria-hidden className="relative mb-6 h-40 w-40">
        <div className="apg-glow absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(248,224,16,0.25),transparent_70%)] blur-lg" />
        {reduced ? (
          <APGLogo variant="icon" className="relative h-full w-full -rotate-12" />
        ) : (
          <LottiePlayer
            src="/lottie/balancing-football.json"
            className="relative h-full w-full"
            ariaLabel=""
          />
        )}
      </div>

      <p className="font-display text-[clamp(4.5rem,16vw,12rem)] uppercase leading-[0.85] tracking-tight text-apg-yellow">
        {t("title")}
      </p>
      <FlagStripe className="mt-6 w-40" />
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
        {t("text")}
      </p>
      <AppLink
        href="/"
        className="apg-focus mt-10 inline-flex min-h-12 items-center bg-apg-yellow px-8 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
      >
        {t("cta")}
      </AppLink>
      <span className="sr-only">{t("text")}</span>
    </section>
  );
}
