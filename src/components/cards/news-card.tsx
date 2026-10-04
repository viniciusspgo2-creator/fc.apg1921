import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import type { NewsRow } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

/* ============================================================
 * NewsCard — DB-driven article card (home teaser + blog feed).
 * Chamfered card with tag chip, cover and date.
 * ============================================================ */

const TAG_DOT: Record<string, string> = {
  "match-day": "bg-apg-yellow",
  mercato: "bg-apg-green",
  club: "bg-apg-blue",
  communaute: "bg-apg-red",
  regional: "bg-apg-blue-deep",
};

export function NewsCard({ post }: { post: NewsRow }) {
  const t = useTranslations();
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(post.createdAt));

  let tagLabel = post.tag;
  try {
    tagLabel = t(`blog.tags.${post.tag}`);
  } catch {
    // unknown tag: show raw value
  }

  return (
    <AppLink
      href={`/blog/${post.slug}`}
      className="apg-focus group flex h-full flex-col border border-ink/10 bg-paper shadow-[0_2px_18px_rgba(0,43,92,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-apg-blue/40 hover:shadow-[0_16px_40px_rgba(0,43,92,0.14)]"
    >
      {post.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-soft">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 border border-ink/15 px-2.5 py-1 font-ui text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70">
            <span aria-hidden className={`inline-block size-1.5 ${TAG_DOT[post.tag] ?? "bg-ink/40"}`} />
            {tagLabel}
          </span>
          <time dateTime={new Date(post.createdAt).toISOString()} className="font-ui text-xs uppercase tracking-wider text-ink/45">
            {date}
          </time>
        </div>

        <h3 className="mt-4 font-display text-3xl leading-[0.95] tracking-tight text-apg-blue-deep transition-colors group-hover:text-apg-blue">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/65">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-end pt-6">
          <span className="inline-flex items-center gap-1.5 font-ui text-xs font-semibold uppercase tracking-[0.18em] text-apg-blue">
            {t("blog.readMore")}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </span>
        </div>
        <FlagStripe className="mt-6 w-14 opacity-70 transition-all duration-300 group-hover:w-24" />
      </div>
    </AppLink>
  );
}
