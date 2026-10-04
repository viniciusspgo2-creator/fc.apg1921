"use client";

/* ============================================================
 * FC APG 1921 — Contact info (2026)
 *
 * Four chamfered cards (stade / email / instagram / entraînements)
 * + the dark Leaflet "mapinha" of Geneva. This is a client
 * component ONLY because it owns the next/dynamic({ ssr: false })
 * import of the Leaflet map — `ssr: false` is not allowed inside
 * Server Components. Values come from the admin settings (DB).
 * ============================================================ */

import {
  Clock,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/* Leaflet must never run during SSR — load it lazily, client-side. */
const ClubMap = dynamic(() => import("./map-leaflet"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="border border-ink/10 bg-ink/5">
      <div className="h-[500px] animate-pulse bg-ink/5" />
    </div>
  ),
});

export type ContactSettings = {
  stadiumName: string;
  stadiumAddress: string;
  email: string;
  instagram: string;
  trainingPrincipal: string;
  trainingVets: string;
};

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

/* Editorial card on light background — hairline border, blue
 * diamond icon, gentle hover. No clipped corners. */
function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 border border-ink/10 bg-paper p-5 shadow-[0_2px_18px_rgba(0,43,92,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-apg-blue/40 sm:p-6">
      <div>
        <span className="flex size-10 rotate-45 items-center justify-center bg-apg-blue text-apg-yellow">
          <Icon className="size-4 -rotate-45" aria-hidden />
        </span>
      </div>
      <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.24em] text-apg-blue-deep">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-ink/75">{children}</div>
    </div>
  );
}

const LINK_CLASS =
  "apg-focus underline decoration-apg-blue/40 underline-offset-4 transition-colors hover:text-apg-blue hover:decoration-apg-blue";

export function ContactInfo({ settings }: { settings: ContactSettings }) {
  const t = useTranslations("contact");
  const instagram = settings.instagram || "https://www.instagram.com/fc.apg.1921/";
  // "https://www.instagram.com/fc.apg.1921/" → "@fc.apg.1921"
  const instagramHandle = `@${new URL(instagram).pathname.replaceAll("/", "")}`;

  return (
    <div className="grid gap-6 sm:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <InfoCard icon={MapPin} title={t("info.addressTitle")}>
          <p>
            {settings.stadiumName}
            <br />
            {settings.stadiumAddress}
          </p>
        </InfoCard>

        <InfoCard icon={Mail} title={t("info.emailTitle")}>
          <a href={`mailto:${settings.email}`} className={LINK_CLASS}>
            {settings.email}
          </a>
        </InfoCard>

        <InfoCard icon={Instagram} title={t("info.instagramTitle")}>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${LINK_CLASS} inline-flex items-center gap-1.5`}
          >
            {instagramHandle}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          </a>
        </InfoCard>

        <InfoCard icon={Clock} title={t("info.trainingTitle")}>
          <p>
            {settings.trainingPrincipal}
            <br />
            {settings.trainingVets}
          </p>
        </InfoCard>
      </div>

      <ClubMap />
    </div>
  );
}
