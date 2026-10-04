"use client";

import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { LangSwitcher } from "@/components/layout/lang-switcher";
import { Instagram } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/* ============================================================
 * Footer — original crest on a light plate, PT stripe, columns.
 * Sticks to the bottom via layout's min-h-screen flex column.
 * ============================================================ */

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/sobre", key: "about" },
  { href: "/galeria", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/contato", key: "contact" },
] as const;

export type FooterSettings = {
  instagram: string;
  email: string;
};

export function Footer({ settings }: { settings: FooterSettings }) {
  const t = useTranslations();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#05070d] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <AppLink
            href="/"
            aria-label="FC APG 1921"
            className="apg-focus inline-block"
          >
            <span className="inline-flex items-center bg-paper p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <Image
                src="/brand/apg-logo-original.png"
                alt=""
                width={72}
                height={72}
                className="h-18 w-18 object-contain"
              />
            </span>
          </AppLink>
          <p className="mt-5 max-w-xs font-serif text-lg italic leading-snug text-white/70">
            {t("footer.tagline")}
          </p>
        </div>

        <nav aria-label={t("footer.quickLinks")}>
          <h2 className="font-ui text-sm font-semibold uppercase tracking-[0.3em] text-apg-yellow">
            {t("footer.quickLinks")}
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV_ITEMS.map(({ href, key }) => (
              <li key={key}>
                <AppLink
                  href={href}
                  className="apg-focus text-sm text-white/60 transition-colors hover:text-apg-yellow"
                >
                  {t(`nav.${key}`)}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-ui text-sm font-semibold uppercase tracking-[0.3em] text-apg-yellow">
            {t("footer.followUs")}
          </h2>
          <a
            href={settings.instagram || "https://www.instagram.com/fc.apg.1921/"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram — FC APG 1921"
            className="apg-focus mt-4 inline-flex min-h-11 items-center gap-2.5 border border-apg-yellow/50 bg-apg-yellow/10 px-4 font-ui text-sm font-semibold uppercase tracking-[0.14em] text-apg-yellow transition-colors duration-300 hover:bg-apg-yellow hover:text-ink"
          >
            <Instagram className="size-4" aria-hidden />
            @fc.apg.1921
          </a>
          <p className="mt-3">
            <a
              href={`mailto:${settings.email || "contact@fc-apg.ch"}`}
              className="apg-focus text-sm text-white/70 transition-colors hover:text-apg-yellow"
            >
              {settings.email || "contact@fc-apg.ch"}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-ui text-sm font-semibold uppercase tracking-[0.3em] text-apg-yellow">
            {t("footer.languages")}
          </h2>
          <div className="mt-4">
            <LangSwitcher />
          </div>
          <ul className="mt-6 space-y-2">
            <li>
              <AppLink
                href="/mentions-legales"
                className="apg-focus text-sm text-white/50 transition-colors hover:text-apg-yellow"
              >
                {t("footer.legal")}
              </AppLink>
            </li>
            <li>
              <AppLink
                href="/confidentialite"
                className="apg-focus text-sm text-white/50 transition-colors hover:text-apg-yellow"
              >
                {t("footer.privacy")}
              </AppLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} FC Association des Portugais de Genève.{" "}
          {t("footer.rights")}
        </p>
      </div>
      <FlagStripe />
    </footer>
  );
}
