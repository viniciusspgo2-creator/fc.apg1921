"use client";

import { FlagStripe } from "@/components/brand/flag-stripe";
import { LangSwitcher } from "@/components/layout/lang-switcher";
import { AppLink } from "@/components/layout/transition-link";
import { usePathname } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* ============================================================
 * Header — original club crest, compact nav, language switcher
 * and a clearly visible Instagram button (yellow-tinted, fills
 * on hover). Mobile menu: readable sizes + Instagram pill.
 * ============================================================ */

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/sobre", key: "about" },
  { href: "/galeria", key: "gallery" },
  { href: "/blog", key: "blog" },
  { href: "/contato", key: "contact" },
] as const;

const INSTAGRAM_FALLBACK = "https://www.instagram.com/fc.apg.1921/";

export function Header({ instagram }: { instagram?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${
          solid
            ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
          <AppLink
            href="/"
            className="apg-focus flex items-center gap-2.5"
            aria-label="FC APG 1921"
          >
            <Image
              src="/brand/apg-logo-original.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] sm:h-11 sm:w-11"
            />
            <span className="font-display text-lg tracking-wide text-white sm:text-xl">
              FC APG 1921
            </span>
          </AppLink>

          {/* Desktop navigation */}
          <nav aria-label={t("footer.quickLinks")} className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map(({ href, key }) => {
                const active = pathname === href;
                return (
                  <li key={key}>
                    <AppLink
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`apg-focus relative inline-flex min-h-11 items-center px-3.5 font-ui text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors xl:text-sm ${
                        active
                          ? "text-apg-yellow"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {t(`nav.${key}`)}
                      {active && (
                        <motion.span
                          layoutId="header-active"
                          className="absolute inset-x-3 bottom-2 h-0.5 bg-apg-yellow"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AppLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Instagram — highly visible (client request) */}
            <a
              href={instagram || INSTAGRAM_FALLBACK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram — FC APG 1921"
              title="Instagram — FC APG 1921"
              className="apg-focus hidden size-10 items-center justify-center border border-apg-yellow/60 bg-apg-yellow/10 text-apg-yellow transition-colors duration-300 hover:bg-apg-yellow hover:text-ink sm:flex"
            >
              <Instagram className="size-4.5" aria-hidden />
            </a>
            <div className="hidden sm:block">
              <LangSwitcher />
            </div>
            <AppLink
              href="/contato"
              className="apg-focus hidden min-h-10 items-center bg-apg-yellow px-4 font-ui text-[13px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white md:inline-flex xl:text-sm"
            >
              {t("shell.join")}
            </AppLink>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="apg-mobile-menu"
              aria-label={menuOpen ? t("shell.menuClose") : t("shell.menuOpen")}
              className="apg-focus flex size-11 flex-col items-center justify-center gap-1.5 text-white lg:hidden"
            >
              <span
                className={`h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
        <FlagStripe />
      </header>

      {/* Mobile fullscreen menu — compact, readable, with languages */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="apg-mobile-menu"
            key="apg-menu"
            className="fixed inset-0 z-[95] flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Grain texture lives on a child layer so it never
                overrides the fixed positioning of the panel. */}
            <div aria-hidden className="apg-grain absolute inset-0" />
            <div className="relative z-[1] flex flex-1 flex-col justify-center px-8 pt-16">
              <nav aria-label={t("footer.quickLinks")}>
                <ul className="space-y-1">
                  {NAV_ITEMS.map(({ href, key }, i) => (
                    <motion.li
                      key={key}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                    >
                      <AppLink
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={pathname === href ? "page" : undefined}
                        className={`apg-focus flex items-baseline gap-3 py-2.5 font-ui text-2xl font-semibold uppercase tracking-[0.14em] transition-colors sm:text-3xl ${
                          pathname === href
                            ? "text-apg-yellow"
                            : "text-white hover:text-apg-yellow"
                        }`}
                      >
                        <span className="font-ui text-xs font-bold text-white/35">
                          0{i + 1}
                        </span>
                        {t(`nav.${key}`)}
                      </AppLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <AppLink
                  href="/contato"
                  onClick={() => setMenuOpen(false)}
                  className="apg-focus inline-flex min-h-12 items-center bg-apg-yellow px-6 font-ui text-sm font-semibold uppercase tracking-[0.16em] text-ink"
                >
                  {t("shell.join")}
                </AppLink>
                <LangSwitcher />
                {/* Instagram — prominent pill in the mobile menu */}
                <a
                  href={instagram || INSTAGRAM_FALLBACK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — FC APG 1921"
                  className="apg-focus inline-flex min-h-12 items-center gap-2.5 border border-apg-yellow/60 bg-apg-yellow/10 px-5 font-ui text-sm font-semibold uppercase tracking-[0.16em] text-apg-yellow"
                >
                  <Instagram className="size-4.5" aria-hidden />
                  Instagram
                </a>
              </motion.div>
            </div>
            <div className="relative z-[1]">
              <FlagStripe />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
