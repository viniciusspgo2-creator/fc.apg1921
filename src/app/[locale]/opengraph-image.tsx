import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

/* ============================================================
 * Dynamic Open Graph image (brief §13) — 1200×630 per locale:
 * ink night field, diamond lattice hint, giant club wordmark,
 * manifesto line and the PT signature stripe.
 * ============================================================ */

export const alt = "FC APG 1921";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070A12",
          padding: "72px 80px",
          color: "#FFFFFF",
        }}
      >
        {/* diamond lattice hint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(60deg, rgba(248,224,16,0.05) 0 1px, transparent 1px 56px), repeating-linear-gradient(-60deg, rgba(248,224,16,0.05) 0 1px, transparent 1px 56px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#F8E010",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#F8E010", transform: "rotate(45deg)" }} />
          GENÈVE · DEPUIS 1921
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>
            {t("titleLine1")}
          </div>
          <div style={{ fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: -2, color: "#F8E010" }}>
            {t("titleLine2")}
          </div>
          <div style={{ marginTop: 18, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>
            FC Association des Portugais de Genève
          </div>
        </div>

        {/* faixa PT */}
        <div style={{ display: "flex", height: 14, width: "100%" }}>
          <div style={{ flex: 2, background: "#03A75E" }} />
          <div style={{ flex: 3, background: "#DF0629" }} />
        </div>
      </div>
    ),
    size,
  );
}
