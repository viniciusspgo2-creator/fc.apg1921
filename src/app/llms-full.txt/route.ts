import { getNewsBySlug, getPublishedNews, getSettings } from "@/lib/content";
import { SITE, siteUrl } from "@/lib/seo";

/* ============================================================
 * /llms-full.txt — full consolidated knowledge file for LLMs:
 * everything in /llms.txt plus the complete content of every
 * published article (incl. FAQs). Cached 1h.
 * ============================================================ */

export const revalidate = 3600;
export const dynamic = "force-dynamic";

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

export async function GET() {
  const base = siteUrl();

  let email: string = SITE.email;
  let trainingPrincipal = "Mardi & jeudi, 19h30";
  let trainingVets = "Vendredi, 20h00";
  let stadium: string = SITE.stadium;
  let stadiumAddress: string = SITE.stadiumAddress;
  try {
    const s = await getSettings([
      "contact.email",
      "contact.trainingPrincipal",
      "contact.trainingVets",
      "stadium.name",
      "stadium.address",
    ]);
    email = s["contact.email"] || email;
    trainingPrincipal = s["contact.trainingPrincipal"] || trainingPrincipal;
    trainingVets = s["contact.trainingVets"] || trainingVets;
    stadium = s["stadium.name"] || stadium;
    stadiumAddress = s["stadium.address"] || stadiumAddress;
  } catch {
    // DB cold — static defaults above are already correct.
  }

  let news: Awaited<ReturnType<typeof getPublishedNews>> = [];
  try {
    news = await getPublishedNews();
  } catch {
    news = [];
  }

  const lines: string[] = [
    `# ${SITE.name} — documentation complète`,
    "",
    `> ${SITE.name} (${SITE.legalName}, abrégé « ${SITE.shortName} ») : club de football amateur genevois fondé le 1er juillet 1921, évoluant en ${SITE.competition}. Stade : ${stadium}, ${stadiumAddress}. Entraînements : ${trainingPrincipal} ; ${trainingVets}. Contact : ${email}.`,
    "",
    "## Faits essentiels",
    "",
    `- Fondation : 1er juillet 1921 à ${SITE.city}`,
    `- Compétition : ${SITE.competition} (matchs à domicile le dimanche matin)`,
    `- Stade : ${stadium} — ${stadiumAddress}`,
    `- Entraînements : ${trainingPrincipal} ; ${trainingVets}`,
    `- Contact : ${email} — WhatsApp via ${base}/fr/contato`,
    "- Ouvert à toutes les nationalités ; six langues sur le site",
    "",
    "## Contenu intégral des articles",
    "",
  ];

  for (const stub of news) {
    const post = await getNewsBySlug(stub.slug).catch(() => null);
    if (!post) continue;
    lines.push(`---`, "", `# ${post.title}`, "", `URL : ${base}/fr/blog/${post.slug}`, "", post.excerpt, "", post.content, "");
    const faq = parseFaq(post.faq);
    if (faq.length > 0) {
      lines.push("## Questions fréquentes", "");
      for (const f of faq) {
        lines.push(`**${f.q}** ${f.a}`, "");
      }
      lines.push("");
    }
  }

  lines.push(
    `---`,
    "",
    `Source officielle : ${base}/fr — ${SITE.name}, fondé le 1er juillet 1921.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
