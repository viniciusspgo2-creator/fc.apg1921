import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getNewsBySlug, getPublishedNews } from "@/lib/content";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  siteUrl,
} from "@/lib/seo";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import type { AppLocale } from "@/types";

/* ============================================================
 * FC APG 1921 — Article page (DB-driven, SEO/GEO edition)
 * Cover + title + meta → markdown body (BLUF, takeaways, GFM
 * tables, FAQ) → source link → author box (E-E-A-T) → prev/next.
 * JSON-LD: Article + FAQPage + BreadcrumbList.
 * ============================================================ */

type FaqItem = { q: string; a: string };

function parseFaq(raw: string): FaqItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is FaqItem =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as FaqItem).q === "string" &&
        typeof (x as FaqItem).a === "string",
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getNewsBySlug(slug).catch(() => null);
  if (!post || !post.published) {
    const t = await getTranslations({ locale, namespace: "blog" });
    return { title: t("title") };
  }
  return buildMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords
      ? post.keywords.split(",").map((k) => k.trim())
      : undefined,
    image: post.cover || undefined,
    type: "article",
    publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();
  const post = await getNewsBySlug(slug);
  if (!post || !post.published) notFound();

  const all = await getPublishedNews();
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const next = idx > 0 ? all[idx - 1] : null;

  const faq = parseFaq(post.faq);
  const published = post.publishedAt ?? post.createdAt;
  const dateFmt = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let tagLabel = post.tag;
  try {
    tagLabel = t(`blog.tags.${post.tag}`);
  } catch {
    // unknown tag: raw value
  }

  /* Styled markdown mapping — tables, lists and headings render
   * as real crawlable HTML (GEO/LLMO: machines parse this easily). */
  const md = {
    h2: (p: React.ComponentProps<"h2">) => (
      <h2
        className="mt-12 font-display text-3xl uppercase leading-tight tracking-tight text-apg-blue-deep first:mt-0 sm:text-4xl"
        {...p}
      />
    ),
    h3: (p: React.ComponentProps<"h3">) => (
      <h3
        className="mt-8 font-display text-2xl leading-tight tracking-tight text-apg-blue sm:text-[1.7rem]"
        {...p}
      />
    ),
    p: (p: React.ComponentProps<"p">) => (
      <p className="text-lg leading-[1.8] text-ink/80" {...p} />
    ),
    ul: (p: React.ComponentProps<"ul">) => (
      <ul
        className="list-none space-y-2 text-lg leading-[1.7] text-ink/80 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.72em] [&_li]:before:size-1.5 [&_li]:before:rotate-45 [&_li]:before:bg-apg-yellow"
        {...p}
      />
    ),
    ol: (p: React.ComponentProps<"ol">) => (
      <ol
        className="list-decimal space-y-2 pl-6 text-lg leading-[1.7] text-ink/80"
        {...p}
      />
    ),
    li: (p: React.ComponentProps<"li">) => <li className="leading-[1.7]" {...p} />,
    strong: (p: React.ComponentProps<"strong">) => (
      <strong className="font-semibold text-ink" {...p} />
    ),
    blockquote: (p: React.ComponentProps<"blockquote">) => (
      <blockquote
        className="border-l-4 border-apg-yellow bg-apg-blue/5 px-6 py-4 font-serif text-xl italic leading-relaxed text-apg-blue-deep"
        {...p}
      />
    ),
    a: ({ href, children, ...rest }: React.ComponentProps<"a">) => {
      if (!href) return <a {...rest}>{children}</a>;
      const internal = href.startsWith("/");
      return internal ? (
        <Link
          href={`/${locale}${href}`}
          className="font-semibold text-apg-blue underline decoration-apg-yellow decoration-2 underline-offset-4 transition-colors hover:text-apg-blue-deep"
        >
          {children}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-apg-blue underline decoration-apg-yellow decoration-2 underline-offset-4 transition-colors hover:text-apg-blue-deep"
        >
          {children}
        </a>
      );
    },
    table: (p: React.ComponentProps<"table">) => (
      <div className="mt-8 overflow-x-auto border border-ink/10 shadow-[0_2px_18px_rgba(0,43,92,0.05)]">
        <table className="w-full border-collapse text-left text-base" {...p} />
      </div>
    ),
    thead: (p: React.ComponentProps<"thead">) => (
      <thead className="bg-apg-blue text-white" {...p} />
    ),
    th: (p: React.ComponentProps<"th">) => (
      <th
        className="border-b border-ink/10 px-4 py-3 font-ui text-xs font-semibold uppercase tracking-[0.14em]"
        {...p}
      />
    ),
    td: (p: React.ComponentProps<"td">) => (
      <td className="border-b border-ink/10 px-4 py-3 align-top text-ink/75" {...p} />
    ),
    tr: (p: React.ComponentProps<"tr">) => (
      <tr className="transition-colors hover:bg-apg-blue/[0.04]" {...p} />
    ),
    hr: () => <hr className="my-10 border-ink/10" />,
  };

  return (
    <article className="bg-paper text-ink">
      <JsonLd
        data={[
          articleJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            locale,
            image: post.cover || undefined,
            published: published.toISOString(),
            modified: post.updatedAt.toISOString(),
            author: post.author || "FC APG 1921",
            keywords: post.keywords || undefined,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "" },
            { name: t("blog.title"), path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          webPageArticleJsonLd(post.title, post.excerpt, post.slug, locale),
          ...(faq.length > 0 ? [faqJsonLd(faq)] : []),
        ]}
      />

      {/* -------------------------------------------------- header */}
      <header className="apg-grain relative overflow-hidden bg-ink pt-28 pb-14 sm:pt-32 sm:pb-16">
        <div className="relative z-[2] mx-auto w-full max-w-4xl px-5 sm:px-8">
          <AppLink
            href="/blog"
            className="apg-focus inline-flex min-h-11 items-center gap-2 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-apg-yellow"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("blog.backToBlog")}
          </AppLink>
          <p className="mt-6 flex flex-wrap items-center gap-3 font-ui text-xs font-semibold uppercase tracking-[0.25em] text-apg-yellow">
            <span aria-hidden className="inline-block size-1.5 bg-current" />
            {tagLabel}
            <time dateTime={published.toISOString()} className="text-white/50">
              {dateFmt.format(published)}
            </time>
          </p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <FlagStripe className="mt-6 w-24" />
          {post.excerpt && (
            <p className="mt-5 max-w-2xl font-serif text-xl italic leading-relaxed text-white/75">
              {post.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* --------------------------------------------------- cover */}
      {post.cover ? (
        <div className="mx-auto -mt-2 w-full max-w-4xl px-5 sm:px-8">
          <div className="relative aspect-[16/8] w-full overflow-hidden shadow-[0_24px_60px_rgba(0,43,92,0.16)]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* --------------------------------------------------- body */}
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
          {post.content}
        </ReactMarkdown>

        {post.sourceUrl ? (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apg-focus mt-10 inline-flex min-h-11 items-center gap-2 border-b-2 border-apg-blue pb-1 font-ui text-sm font-semibold uppercase tracking-[0.16em] text-apg-blue transition-colors hover:border-apg-yellow hover:text-apg-blue-deep"
          >
            <ExternalLink className="size-4" aria-hidden />
            {t("blog.source")}: {new URL(post.sourceUrl).hostname}
          </a>
        ) : null}

        {/* E-E-A-T author box */}
        <aside
          aria-label={t("blog.authorBox")}
          className="mt-12 flex flex-wrap items-center gap-5 border border-ink/10 bg-paper-soft p-6"
        >
          <span
            aria-hidden
            className="flex size-14 shrink-0 items-center justify-center bg-apg-blue font-display text-lg tracking-widest text-white"
          >
            APG
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg uppercase tracking-wide text-apg-blue-deep">
              {post.author || "FC APG 1921"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">
              {t("blog.authorBio")}
            </p>
            <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.2em] text-ink/40">
              {t("blog.publishedOn")}{" "}
              {dateFmt.format(published)}
              {post.updatedAt.getTime() - published.getTime() > 86_400_000
                ? ` · ${t("blog.updatedOn")} ${dateFmt.format(post.updatedAt)}`
                : ""}
            </p>
          </div>
          <AppLink
            href="/contato"
            data-analytics="article_contact"
            className="apg-focus inline-flex min-h-11 items-center gap-2 bg-apg-blue px-5 font-ui text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-apg-blue-deep"
          >
            {t("blog.authorCta")}
            <ArrowRight className="size-4" aria-hidden />
          </AppLink>
        </aside>
      </div>

      {/* ------------------------------------------- prev / next */}
      {(prev || next) && (
        <nav
          aria-label={t("blog.backToBlog")}
          className="border-t border-ink/10 bg-paper-soft"
        >
          <div className="mx-auto grid w-full max-w-4xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8">
            {prev ? (
              <AppLink
                href={`/blog/${prev.slug}`}
                className="apg-focus group border border-ink/10 bg-paper p-5 transition-colors hover:border-apg-blue"
              >
                <span className="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
                  {t("blog.backToBlog")}
                </span>
                <span className="mt-2 block font-display text-xl leading-tight text-apg-blue-deep">
                  {prev.title}
                </span>
              </AppLink>
            ) : (
              <span aria-hidden />
            )}
            {next ? (
              <AppLink
                href={`/blog/${next.slug}`}
                className="apg-focus group border border-ink/10 bg-paper p-5 text-right transition-colors hover:border-apg-blue sm:text-right"
              >
                <span className="flex items-center justify-end gap-2 font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                  {t("blog.readMore")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
                <span className="mt-2 block font-display text-xl leading-tight text-apg-blue-deep">
                  {next.title}
                </span>
              </AppLink>
            ) : null}
          </div>
        </nav>
      )}
    </article>
  );
}

/** Local helper — WebPage node tied to the article. */
function webPageArticleJsonLd(
  title: string,
  description: string,
  slug: string,
  locale: string,
) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base}/${locale}/blog/${slug}#webpage`,
    name: title,
    description,
    url: `${base}/${locale}/blog/${slug}`,
    inLanguage: locale,
    isPartOf: { "@id": `${base}/#website` },
  };
}
