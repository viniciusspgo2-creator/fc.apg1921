import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/* ============================================================
 * robots.txt — crawl + AI/GEO policy.
 * Search engines: full access (admin + APIs excluded).
 * Generative engines explicitly welcomed: GPTBot, OAI-SearchBot,
 * ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, CCBot…
 * ============================================================ */

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        // Major search crawlers — explicit green light.
        userAgent: ["Googlebot", "Googlebot-Image", "Bingbot", "DuckDuckBot", "Applebot"],
        allow: "/",
      },
      {
        // LLM / generative engines — GEO opt-in (cite us!).
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "Google-Extended",
          "CCBot",
          "Bytespider",
          "Applebot-Extended",
          "cohere-ai",
          "Meta-ExternalAgent",
        ],
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
