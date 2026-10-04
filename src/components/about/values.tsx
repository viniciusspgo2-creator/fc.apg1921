"use client";

import { GlowCard } from "@/components/ui/glow-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CLUB } from "@/data/mock";
import type { ValueIcon } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, Handshake, Shield, Users, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/* ============================================================
 * Values (2026) — the 4 club values as clean editorial cards.
 * Lucide icon inside the brand diamond (rotated square); on hover
 * (fine pointers) the diamond tilts/scales subtly and a yellow
 * streak sweeps the card. Staggered 80ms via Reveal delay. Reduced motion: static.
 * ============================================================ */

const VALUES: { id: string; icon: ValueIcon }[] = [
  { id: "tradition", icon: "shield" },
  { id: "communaute", icon: "users" },
  { id: "passion", icon: "flame" },
  { id: "respect", icon: "handshake" },
];

const VALUE_ICONS: Record<ValueIcon, LucideIcon> = {
  shield: Shield,
  users: Users,
  flame: Flame,
  handshake: Handshake,
};

export function Values() {
  const t = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section
      className="apg-grain bg-ink py-20 lg:py-28"
      aria-labelledby="values-title"
    >
      <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="values-title"
          tone="dark"
          kicker={CLUB.shortName}
          title={t("about.valuesTitle")}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[v.icon];
            return (
              <Reveal key={v.id} delay={i * 0.08} className="h-full">
                <GlowCard className="group h-full border border-white/12 bg-white/[0.045] transition-colors duration-300 hover:border-apg-yellow/40">
                  <motion.article
                    initial="rest"
                    animate="rest"
                    whileHover={reduced ? undefined : "hover"}
                    className="relative z-[2] flex h-full flex-col p-6"
                  >
                    {/* Yellow streak sweeping on hover */}
                    <motion.span
                      aria-hidden
                      variants={{
                        rest: { x: "-140%", opacity: 0, skewX: -12 },
                        hover: {
                          x: "150%",
                          opacity: [0, 1, 0],
                          skewX: -12,
                        },
                      }}
                      transition={{
                        x: { duration: 0.9, ease: "easeInOut" },
                        opacity: { duration: 0.9, ease: "easeInOut" },
                      }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-apg-yellow/12"
                    />

                    {/* Icon in the brand diamond (crisp rotated square) */}
                    <motion.span
                      aria-hidden
                      variants={{
                        rest: { rotate: 45, scale: 1 },
                        hover: { rotate: 53, scale: 1.08 },
                      }}
                      transition={{ type: "spring", stiffness: 320, damping: 16 }}
                      className="mt-1 ml-1 flex size-11 shrink-0 rotate-45 items-center justify-center bg-apg-blue"
                    >
                      <Icon className="size-5 -rotate-45 text-apg-yellow" />
                    </motion.span>

                    <h3 className="mt-6 font-display text-2xl uppercase leading-tight text-white">
                      {t(`about.values.${v.id}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {t(`about.values.${v.id}.text`)}
                    </p>
                  </motion.article>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
