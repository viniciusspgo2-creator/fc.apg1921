import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics/analytics";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FloatingActions } from "@/components/layout/floating-actions";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { TransitionProvider, PageFade } from "@/components/layout/transition-link";
import { VisitTracker } from "@/components/layout/visit-tracker";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "../globals.css";

/* ============================================================
 * FC APG 1921 — locale layout (lightweight, fast by design).
 * No artificial loaders, no heavy transitions: navigation is
 * instant; settings flow from the DB to header/footer/float.
 * ============================================================ */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#070A12",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const base = buildMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    keywords: (t("keywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  });

  return {
    ...base,
    metadataBase: new URL(siteUrl()),
    title: {
      default: t("title"),
      template: `%s · ${t("siteName")}`,
    },
    icons: {
      icon: [
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/brand/favicon-180.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const tShell = await getTranslations({ locale, namespace: "shell" });

  const settings = await getSettings([
    "whatsapp.number",
    "social.instagram",
    "contact.email",
  ]);

  const shell = {
    whatsapp: settings["whatsapp.number"] ?? "",
    instagram: settings["social.instagram"] ?? "",
    email: settings["contact.email"] ?? "",
  };

  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontVariables} flex min-h-screen flex-col bg-ink font-body text-white antialiased`}
      >
        {/* Knowledge graph — club entity + website, on every page */}
        <JsonLd
          data={[
            organizationJsonLd({
              instagram: shell.instagram,
              email: shell.email,
            }),
            websiteJsonLd(tMeta("siteName")),
          ]}
        />
        <Analytics />
        <NextIntlClientProvider>
          <TransitionProvider>
            <SmoothScroll>
              <a
                href="#main-content"
                className="apg-focus sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[140] focus:bg-apg-yellow focus:px-4 focus:py-2 focus:font-ui focus:text-sm focus:font-semibold focus:uppercase focus:text-ink"
              >
                {tShell("skipToContent")}
              </a>
              <Header instagram={shell.instagram} />
              <main id="main-content" className="flex-1">
                <PageFade>{children}</PageFade>
              </main>
              <Footer settings={{ instagram: shell.instagram, email: shell.email }} />
              <FloatingActions whatsappNumber={shell.whatsapp} />
              <VisitTracker />
              <CookieBanner />
            </SmoothScroll>
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
