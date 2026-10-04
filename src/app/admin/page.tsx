import { AdminApp } from "@/components/admin/admin-app";
import { AdminLogin } from "@/components/admin/login";
import { isAdminRequest } from "@/lib/admin-auth";
import { TEXT_SECTIONS } from "@/lib/content-schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel · FC APG 1921",
  robots: { index: false, follow: false },
};

/* Flatten a nested translation object into "a.b.c" keys. */
function flatten(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj === null || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") {
      Object.assign(out, flatten(v, key));
    } else if (typeof v === "string") {
      out[key] = v;
    }
  }
  return out;
}

export default async function AdminPage() {
  const authed = await isAdminRequest();

  if (!authed) {
    return <AdminLogin />;
  }

  // Fallbacks used by the text editor (DB value overrides these).
  const usedKeys = new Set<string>(
    TEXT_SECTIONS.flatMap((s) => s.items.map((i) => i.key)),
  );
  const [fr, en, de, pt, es, it] = (await Promise.all([
    import("@/locales/fr.json"),
    import("@/locales/en.json"),
    import("@/locales/de.json"),
    import("@/locales/pt.json"),
    import("@/locales/es.json"),
    import("@/locales/it.json"),
  ])).map((m) => m.default);

  const fallbacks: Record<string, Record<string, string>> = {
    fr: fr as unknown as Record<string, string>,
    en: en as unknown as Record<string, string>,
    de: de as unknown as Record<string, string>,
    pt: pt as unknown as Record<string, string>,
    es: es as unknown as Record<string, string>,
    it: it as unknown as Record<string, string>,
  };
  for (const locale of Object.keys(fallbacks)) {
    const flat = flatten(fallbacks[locale]);
    fallbacks[locale] = Object.fromEntries(
      Object.entries(flat).filter(([k]) => usedKeys.has(k)),
    );
  }

  return (
    <AdminApp
      fallbacks={fallbacks}
      passwordIsDefault={process.env.ADMIN_PASSWORD === undefined}
    />
  );
}
