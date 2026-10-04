"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

/* ============================================================
 * FloatingActions — WhatsApp bubble (bottom-right) + back-to-top
 * arrow. Always accessible, 44px+ targets, subtle entrance.
 * ============================================================ */

export function FloatingActions({ whatsappNumber }: { whatsappNumber: string }) {
  const t = useTranslations("common");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* WhatsApp */}
      <a
        href={
          whatsappNumber
            ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Bonjour FC APG 1921 👋")}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="float_whatsapp"
        aria-label={whatsappNumber ? t("whatsapp") : t("whatsappMock")}
        title={whatsappNumber ? t("whatsapp") : t("whatsappMock")}
        className="apg-focus fixed right-4 bottom-4 z-[90] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      >
        <MessageCircle className="size-7" aria-hidden />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
      </a>

      {/* Back to top */}
      <button
        type="button"
        onClick={toTop}
        aria-label={t("backToTop")}
        title={t("backToTop")}
        className={`apg-focus fixed right-4 bottom-[5.5rem] z-[90] flex size-11 items-center justify-center border border-white/15 bg-ink/85 text-white backdrop-blur-md transition-all duration-300 hover:border-apg-yellow hover:text-apg-yellow sm:right-6 sm:bottom-[6.5rem] ${
          showTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp className="size-5" aria-hidden />
      </button>
    </>
  );
}
