"use client";

import Script from "next/script";
import { useEffect } from "react";

/* ============================================================
 * Analytics — GA4 + Google Tag Manager, activated by env vars:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   (GA4 measurement ID)
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX   (container ID)
 * When neither is set, zero third-party JS is loaded (GDPR-lean).
 *
 * Auto-tracked events (dataLayer + gtag):
 *   • cta_click       — any element with [data-analytics="id"]
 *   • scroll_depth    — 25 / 50 / 75 / 100 % per pageview
 *   • contact_form_submit — fired by the contact form
 * ============================================================ */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push an event to GTM dataLayer and GA4 (no-op when absent). */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
}

export function Analytics() {
  const enabled = Boolean(GA_ID || GTM_ID);

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest?.("[data-analytics]");
      const id = el?.getAttribute("data-analytics");
      if (id) trackEvent("cta_click", { cta_id: id });
    };
    document.addEventListener("click", onClick);

    const marks = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((window.scrollY / max) * 100);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !marks.has(m)) {
          marks.add(m);
          trackEvent("scroll_depth", { percent: m });
        }
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  if (!GA_ID && !GTM_ID) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
    </>
  );
}
