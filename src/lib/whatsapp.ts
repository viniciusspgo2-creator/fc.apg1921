/* ============================================================
 * FC APG 1921 — WhatsApp deep-link helper (brief §9.5)
 *
 * The contact form never stores data server-side: it composes a
 * WhatsApp message and opens wa.me. The club number lives in
 * NEXT_PUBLIC_WHATSAPP_NUMBER (international format, digits only).
 *
 * Until the club provides the real number the env is empty: the
 * helper falls back to a placeholder so the flow stays demoable,
 * and WHATSAPP_IS_MOCK lets the UI disclose it honestly.
 * ============================================================ */

const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** Placeholder used while the real club number is missing (§12). */
export const WHATSAPP_FALLBACK_NUMBER = "41790000000";

/**
 * True when NEXT_PUBLIC_WHATSAPP_NUMBER is unset/empty — the UI
 * shows a discreet mock chip (title = common.mockNotice) next to
 * the WhatsApp panel title.
 */
export const WHATSAPP_IS_MOCK =
  RAW_NUMBER.replace(/\D/g, "").length === 0;

/** Sanitized club number (digits only) or the placeholder. */
export const WHATSAPP_NUMBER = WHATSAPP_IS_MOCK
  ? WHATSAPP_FALLBACK_NUMBER
  : RAW_NUMBER.replace(/\D/g, "");

/**
 * Build a https://wa.me deep link. The number is sanitized to
 * digits only; an empty message falls back to a neutral greeting.
 */
export function buildWhatsAppUrl(
  number: string,
  message: string,
): string {
  const digits = number.replace(/\D/g, "");
  const safeNumber =
    digits.length > 0 ? digits : WHATSAPP_FALLBACK_NUMBER;
  const text = message.trim().length > 0 ? message : "Bonjour";
  return `https://wa.me/${safeNumber}?text=${encodeURIComponent(text)}`;
}
