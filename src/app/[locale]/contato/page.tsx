import { FlagStripe } from "@/components/brand/flag-stripe";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { CircleAlert, ChevronDown, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getSettings } from "@/lib/content";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import type { AppLocale } from "@/types";

/* ============================================================
 * FC APG 1921 — Contacto (2026)
 * Dark grain header → form (left) + WhatsApp panel (right,
 * sticky) → 4 info cards + dark "mapinha" of Geneva.
 * No data is stored: the form opens a pre-filled wa.me chat.
 * Number, email, trainings and stadium come from the admin DB.
 * ============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({
    locale,
    path: "/contato",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();

  const settings = await getSettings([
    "whatsapp.number",
    "contact.email",
    "contact.trainingPrincipal",
    "contact.trainingVets",
    "stadium.name",
    "stadium.address",
    "social.instagram",
  ]);

  const waNumber = (settings["whatsapp.number"] ?? "").replace(/\D/g, "");
  const isMock = waNumber.length === 0;
  const waSafe = isMock ? "41790000000" : waNumber;

  const contactSettings = {
    stadiumName: settings["stadium.name"] ?? "Centre Sportif de Vessy",
    stadiumAddress: settings["stadium.address"] ?? "Chemin de Vessy, 1206 Genève",
    email: settings["contact.email"] ?? "contact@fc-apg.ch",
    instagram: settings["social.instagram"] ?? "https://www.instagram.com/fc.apg.1921/",
    trainingPrincipal: settings["contact.trainingPrincipal"] ?? "Mardi & jeudi, 19h30",
    trainingVets: settings["contact.trainingVets"] ?? "Vendredi, 20h00",
  };

  const contactTitle = t("contact.title");
  const contactSubtitle = t("contact.subtitle");
  const faq = [
    { q: t("contact.faq.items.q1"), a: t("contact.faq.items.a1") },
    { q: t("contact.faq.items.q2"), a: t("contact.faq.items.a2") },
    { q: t("contact.faq.items.q3"), a: t("contact.faq.items.a3") },
    { q: t("contact.faq.items.q4"), a: t("contact.faq.items.a4") },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: contactTitle,
            description: contactSubtitle,
            path: "/contato",
            locale,
            type: "ContactPage",
            breadcrumb: breadcrumbJsonLd([
              { name: "Accueil", path: "" },
              { name: contactTitle, path: "/contato" },
            ]),
          }),
          faqJsonLd(faq),
        ]}
      />

      {/* -------------------------------------------- page header */}
      <header className="apg-grain apg-diamonds relative bg-ink">
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16">
          <Reveal>
            <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
              <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
              {t("contact.label")}
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("contact.title")}
            </h1>
            <FlagStripe className="mt-6 w-24" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              {t("contact.subtitle")}
            </p>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------- form + whatsapp + infos */}
      <section
        className="apg-diamonds-light bg-paper-soft py-14 sm:py-20"
        aria-label={t("contact.title")}
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-3">
              <ContactForm number={waSafe} />
            </div>

            {/* WhatsApp direct panel */}
            <aside
              className="self-start lg:sticky lg:top-28 lg:col-span-2"
              aria-label={t("contact.whatsapp.title")}
            >
              <div className="border border-white/10 bg-ink shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="apg-diamonds relative bg-ink">
                  <FlagStripe className="w-full" />
                  <div className="relative z-[2] p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-3xl uppercase tracking-tight text-white sm:text-4xl">
                        {t("contact.whatsapp.title")}
                      </h2>
                      {isMock ? (
                        <span
                          title={t("common.whatsappMock")}
                          aria-label={t("common.whatsappMock")}
                          className="inline-flex"
                        >
                          <CircleAlert className="size-4 text-apg-yellow" aria-hidden />
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {t("contact.whatsapp.text")}
                    </p>
                    <a
                      href={buildWhatsAppUrl(waSafe, "Bonjour")}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics="contact_whatsapp"
                      className="apg-focus mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-apg-yellow px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      {t("contact.whatsapp.cta")}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* info cards + dark Leaflet map */}
          <div className="mt-12 sm:mt-16">
            <ContactInfo settings={contactSettings} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------- FAQ (GEO-ready) */}
      <section className="bg-paper py-14 text-ink sm:py-20" aria-label={t("contact.faq.title")}>
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-blue">
              <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
              {t("contact.faq.kicker")}
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-apg-blue-deep sm:text-5xl">
              {t("contact.faq.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8 divide-y divide-ink/10 border border-ink/10 bg-paper-soft">
              {faq.map((item) => (
                <details key={item.q} className="group">
                  <summary className="apg-focus flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-ui text-base font-semibold text-apg-blue-deep transition-colors hover:bg-apg-blue/5 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      aria-hidden
                      className="size-5 shrink-0 text-apg-blue transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-base leading-relaxed text-ink/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
