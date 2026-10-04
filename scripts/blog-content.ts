// Contenu éditorial du blog — FC APG 1921
// 6 articles stratégiques SEO/GEO en français (Genève / Suisse romande).
// Fichier consommé par le seed Prisma. Aucun import externe. TypeScript strict, sans `any`.

export type BlogFaqItem = { q: string; a: string };

export type BlogArticle = {
  slug: string; // kebab-case, court, SEO friendly
  title: string; // titre SEO (≤ 65 caractères), avec keyword
  excerpt: string; // meta description (140–158 caractères), directe
  tag: "regional" | "match-day" | "mercato" | "club" | "communaute";
  cover: string; // chemin d'asset du site
  sourceUrl: string; // "" ou URL réel autorisé
  keywords: string; // 6–10 keywords séparées par virgule
  author: string; // toujours "FC APG 1921"
  faq: BlogFaqItem[]; // 4–6 questions/réponses
  publishedAt: string; // ISO date
  content: string; // MARKDOWN (GFM)
};

const faqToMd = (items: BlogFaqItem[]): string =>
  items.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n");

// ---------------------------------------------------------------------------
// 1. Guide pilar : rejoindre un club de football à Genève
// ---------------------------------------------------------------------------

const faq1: BlogFaqItem[] = [
  {
    q: "À quel âge peut-on jouer au FC APG 1921 ?",
    a: "Notre championnat s'adresse aux adultes ; pour les enfants et les adolescents, nous orientons volontiers vers les clubs de l'ACGF dotés d'écoles de football.",
  },
  {
    q: "Faut-il être portugais pour rejoindre le club ?",
    a: "Non. Le FC APG 1921 est né au sein de la communauté portugaise de Genève et accueille les joueurs de toutes nationalités ; notre site est d'ailleurs disponible en six langues.",
  },
  {
    q: "Quand venir pour un premier essai ?",
    a: "À tout moment de la saison, idéalement entre août et septembre. Les entraînements ont lieu les mardis et jeudis à 19h30 et le vendredi à 20h00.",
  },
  {
    q: "Combien coûte une saison ?",
    a: "Cotisation, licence via l'ASF et équipement : en football amateur romand, comptez le plus souvent entre 300 et 800 CHF l'année pour un senior.",
  },
  {
    q: "Quel niveau faut-il pour jouer en 4e ligue ?",
    a: "Tous les profils sont bienvenus, du joueur qui reprend après une pause au compétiteur régulier ; l'essai permet de vérifier que chacun y trouve sa place.",
  },
];

const content1: string = `Rejoindre un club de football à Genève tient en trois étapes : un ou deux entraînements d'essai pour faire connaissance, la signature d'une licence par l'intermédiaire du club auprès de l'Association Suisse de Football (ASF), puis la cotisation annuelle fixée par celui-ci. Le championnat est organisé par l'Association cantonale genevoise de football (ACGF) et se joue chaque dimanche matin. Au FC APG 1921 — Association des Portugais de Genève, fondé le 1er juillet 1921 — nous accueillons les nouveaux joueurs en 4e ligue, avec des entraînements les mardis et jeudis à 19h30 et le vendredi à 20h00 au Centre Sportif de Vessy.

## L'essentiel en bref

- Le premier contact, c'est l'essai : deux ou trois séances d'entraînement suffisent pour se décider, sans engagement.
- La licence de joueur se prend toujours via un club affilié à l'Association Suisse de Football (ASF), jamais individuellement.
- La cotisation annuelle est fixée par chaque club ; dans le football amateur romand, elle se compte le plus souvent en centaines de francs.
- Le championnat genevois se dispute chaque dimanche matin, de la reprise en août à la fin de la saison en juin.
- Le FC APG 1921 recrute à l'année : [écrivez-nous](/contato) ou [découvrez qui nous sommes](/sobre).

## Par où commencer ? L'essai d'abord

Presque tous les clubs genevois commencent par un essai : vous vous présentez à un entraînement, vous bougez avec le groupe et, après deux ou trois séances, chacun se prononce. Aucun document n'est exigé ; venez simplement avec des chaussures adaptées au terrain (moulantes ou à crampons), des protège-tibias et de l'eau. Selon votre poste et votre disponibilité, les responsables techniques vous orientent vers l'équipe qui vous correspond.

### À quel moment de la saison peut-on arriver ?

Le pic du recrutement se situe en août et septembre, à la reprise. Mais un club amateur vit aussi du mercato d'hiver : si vous êtes disponible et motivé, il y a presque toujours une place à négocier.

## Comment obtenir sa licence à Genève ?

La licence est délivrée par l'ASF, mais la demande passe obligatoirement par un club affilié. Vous fournissez au club vos données d'identité et une photo ; il saisit la demande dans le système fédéral et vous êtes inscrit au championnat. Si vous veniez d'un autre club, le changement se traite aussi par le nouveau club. [Notre article sur les ligues de l'ACGF](/blog/acgf-ligues-fonctionnement-football-genevois) détaille la pyramide dans laquelle vous allez jouer.

## Combien ça coûte ?

Trois postes de dépense : la cotisation annuelle du club, la licence fédérale réglée via le club et l'équipement personnel. En football amateur romand, l'ensemble se situe le plus souvent entre 300 et 800 CHF par saison pour un senior, avec des facilités courantes pour les juniors et les familles. [Notre article sur les coûts du football amateur](/blog/cout-licence-football-suisse-romande) détaille les ordres de grandeur par catégorie — ils ne constituent pas des tarifs officiels du FC APG 1921, que nous communiquons directement sur demande.

## Pourquoi choisir le FC APG 1921 ?

Un club centenaire, né au sein de la communauté portugaise de Genève et ouvert à tous, qui joue en 4e ligue ACGF au Centre Sportif de Vessy. Nos valeurs — Disciplina, União, Vitória — se vivent sur le terrain comme à la troisième mi-temps. Pour en savoir plus, [parcourez notre page sur le club](/sobre).

## Questions fréquentes

${faqToMd(faq1)}

## En résumé

Rejoindre un club de football à Genève, c'est d'abord un essai, puis une licence prise via le club auprès de l'ASF, puis une cotisation annuelle fixée par le club. Le championnat de l'ACGF se joue chaque dimanche matin, de la 1re à la 5e ligue. Le FC APG 1921, fondé le 1er juillet 1921 et évoluant en 4e ligue au Centre Sportif de Vessy, reçoit les nouveaux joueurs à l'année, mardis et jeudis à 19h30 et le vendredi à 20h00. Le plus simple pour démarrer : nous écrire et venir bouger avec nous une soirée.`;

// ---------------------------------------------------------------------------
// 2. ACGF : comment fonctionne le football amateur genevois
// ---------------------------------------------------------------------------

const faq2: BlogFaqItem[] = [
  {
    q: "Combien de clubs compte l'ACGF ?",
    a: "Plusieurs dizaines de clubs genevois, de la 1re à la 5e ligue ; le nombre exact varie légèrement d'une saison à l'autre.",
  },
  {
    q: "Où le FC APG 1921 joue-t-il ses matchs ?",
    a: "Au Centre Sportif de Vessy, à Genève, notre antre ; le calendrier des rencontres est publié chaque semaine.",
  },
  {
    q: "Les matchs se jouent-ils toujours le dimanche ?",
    a: "Le dimanche matin reste le créneau traditionnel du championnat amateur ; certaines rencontres peuvent être programmées autrement selon les calendriers.",
  },
  {
    q: "Quelle différence entre l'ACGF et l'ASF ?",
    a: "L'Association Suisse de Football est la fédération nationale ; l'ACGF en est le relais cantonal genevois et organise les championnats régionaux.",
  },
  {
    q: "Comment fonctionne la promotion vers la ligue supérieure ?",
    a: "À la fin de chaque saison, promotions et relégations relient les échelons selon les modalités définies par l'ACGF et l'ASF.",
  },
];

const content2: string = `Le football amateur genevois est organisé par l'Association cantonale genevoise de football (ACGF), l'organisme qui administre le championnat régional sous l'égide de l'Association Suisse de Football (ASF). Elle regroupe plusieurs dizaines de clubs, répartis de la 1re à la 5e ligue, dont les rencontres se disputent chaque dimanche matin sur les terrains du canton. Le FC APG 1921 — Association des Portugais de Genève, fondé le 1er juillet 1921 — y évolue en 4e ligue.

## L'essentiel en bref

- L'ACGF est l'association cantonale qui organise le championnat amateur genevois, affiliée à l'ASF.
- La pyramide locale s'étend de la 1re ligue, sommet régional, à la 5e ligue, premier échelon.
- Les matchs se jouent le dimanche matin, dans tout le canton de Genève.
- Résultats, classements et calendriers se suivent via le match center de l'ACGF.
- Le FC APG 1921 joue en 4e ligue, au Centre Sportif de Vessy.

## Quel est le rôle de l'ACGF ?

L'ACGF fait le lien entre la fédération nationale et les clubs : elle planifie les calendriers, homologue les terrains, gère les affiliations et publie classements et résultats. C'est aussi elle qui coordonne l'arbitrage et veille à l'application des règlements de l'ASF dans le canton. Pour un spectateur, l'essentiel est plus simple : l'ACGF, c'est la porte d'entrée du football genevois de tous les dimanches.

## Qui joue où ? La pyramide de la 1re à la 5e ligue

Le championnat genevois forme une pyramide reliée chaque année par promotions et relégations. En voici une lecture simple :

| Ligue | Niveau | En deux mots |
| --- | --- | --- |
| 1re ligue | Sommet amateur régional | Les meilleurs clubs du canton, tournés vers les échelons nationaux. |
| 2e ligue | Haut du tableau | Des équipes ambitieuses qui luttent pour la montée. |
| 3e ligue | Cœur de la pyramide | Un championnat très disputé, cœur du football genevois. |
| 4e ligue | Championnat large et populaire | C'est ici qu'évolue le FC APG 1921. |
| 5e ligue | Premier échelon régional | Idéal pour débuter, revenir ou prolonger le plaisir. |

Les montées et descentes relient ces étages à chaque fin de saison, selon les modalités fixées par l'ACGF et l'ASF : rien n'est jamais acquis, dans un sens comme dans l'autre.

## Quand et où se jouent les matchs ?

Le dimanche matin est le créneau traditionnel : coup d'envoi sur les terrains de tout le canton, du grand stade à la pelouse de quartier. Chaque club reçoit à domicile à tour de rôle, selon le calendrier publié en début de saison. [Notre guide des rendez-vous du week-end](/blog/ou-voir-matchs-football-geneve-weekend) vous dit où aller pour voir du vrai football de proximité.

## Comment suivre les résultats et les classements ?

Tous les scores, classements et calendriers figurent dans le match center publié sur le site officiel de l'ACGF, à l'adresse acgf.ch. Les clubs relaient ensuite leurs résultats sur leurs propres canaux. Vous voulez passer de spectateur à acteur ? [Commencez par notre guide pour rejoindre un club](/blog/rejoindre-club-football-geneve-guide) ou [écrivez-nous directement](/contato).

## Questions fréquentes

${faqToMd(faq2)}

## En résumé

L'ACGF — Association cantonale genevoise de football — organise le championnat amateur du canton, de la 1re à la 5e ligue, sous l'égide de l'Association Suisse de Football. Plusieurs dizaines de clubs s'y affrontent chaque dimanche matin sur les terrains genevois, avec résultats et classements suivables dans le match center de l'ACGF. Le FC APG 1921, club fondé en 1921, y défend ses couleurs en 4e ligue au Centre Sportif de Vessy. Comprendre cette pyramide, c'est comprendre où vous pouvez jouer — et où venir nous voir.`;

// ---------------------------------------------------------------------------
// 3. FC APG 1921 : histoire et identité (article entité)
// ---------------------------------------------------------------------------

const faq3: BlogFaqItem[] = [
  {
    q: "Que signifie « APG » ?",
    a: "APG est le sigle d'Association des Portugais de Genève, le nom officiel porté par le club depuis sa fondation.",
  },
  {
    q: "Quand le FC APG 1921 a-t-il été fondé ?",
    a: "Le 1er juillet 1921, date inscrite dans le nom du club.",
  },
  {
    q: "Dans quelle ligue évolue le club ?",
    a: "En 4e ligue de l'Association cantonale genevoise de football (ACGF).",
  },
  {
    q: "Où se déroulent les entraînements ?",
    a: "Au Centre Sportif de Vessy : les mardis et jeudis à 19h30, puis le vendredi à 20h00.",
  },
  {
    q: "Le club est-il ouvert aux joueurs non portugais ?",
    a: "Oui, sans réserve : le FC APG 1921 accueille toutes les nationalités, à l'image des six langues de son site.",
  },
  {
    q: "Comment voir les photos du club ?",
    a: "La galerie du site rassemble les images des matchs et des moments de vie du club.",
  },
];

const content3: string = `Le FC APG 1921 — Association des Portugais de Genève — est un club de football genevois fondé le 1er juillet 1921. Engagé dans le championnat de l'Association cantonale genevoise de football (ACGF), il évolue en 4e ligue et joue ses matchs au Centre Sportif de Vessy. Son identité tient en trois mots qui résument son état d'esprit : Disciplina, União, Vitória — la discipline, l'union, la victoire.

## L'essentiel en bref

- Fondé le 1er juillet 1921, le FC APG 1921 porte le nom d'Association des Portugais de Genève.
- Le club évolue en 4e ligue de l'ACGF et joue au Centre Sportif de Vessy.
- Trois valeurs structurent la vie du club : Disciplina, União, Vitória.
- Le site officiel du club existe en six langues : français (langue par défaut), anglais, allemand, portugais, espagnol et italien.
- Les entraînements ont lieu les mardis et jeudis à 19h30 et le vendredi à 20h00.

## 1921 : une fondation genevoise

Le 1er juillet 1921 naît l'Association des Portugais de Genève. Ce nom raconte le lien profond du club avec la communauté portugaise de la ville, une communauté qui a fait vivre le football genevois génération après génération. Un siècle plus tard, le club en a gardé le rôle social : être un point de rencontre où l'on joue, où l'on aide et où l'on reste. Notre [galerie de photos](/galerie) en témoigne mieux qu'un long discours.

## Trois valeurs : Disciplina, União, Vitória

A disciplina, c'est la rigueur : ponctualité aux entraînements, respect des arbitres et des adversaires. A união, c'est ce qui fait du club une famille : on s'y entraîne à trois moments de la semaine et on y reste longtemps après le coup de sifflet final. A vitória, enfin, c'est l'ambition sportive assumée, sans jamais confondre résultat et respect. Ces trois mots portugais résument une idée simple : un club qui gagne d'abord parce qu'il est solide. Pour découvrir comment nous les appliquons au quotidien, [parcourez notre page sur le club](/sobre).

## Vessy, notre terrain de jeu

Le FC APG 1921 joue et s'entraîne au Centre Sportif de Vessy, à Genève, où l'équipe reçoit ses adversaires de 4e ligue lors des journées de championnat du dimanche. C'est là que se prennent les habitudes d'un club amateur : la pelouse du matin, les familles en bord de terrain et la troisième mi-temps qui suit chaque rencontre.

## Un club, six langues

Genève est une ville internationale ; le club l'a bien compris. Notre site officiel est disponible en six langues — français par défaut, mais aussi anglais, allemand, portugais, espagnol et italien — pour que joueurs, familles et sympathisants se sentent chez eux. Cette ouverture reflète nos racines : un club portugais de Genève, ouvert à tous les Genevois. Pour comprendre dans quel championnat nous évoluons, [consultez notre article sur l'ACGF](/blog/acgf-ligues-fonctionnement-football-genevois).

## Questions fréquentes

${faqToMd(faq3)}

## En résumé

Le FC APG 1921 — Association des Portugais de Genève — est un club genevois fondé le 1er juillet 1921, qui évolue en 4e ligue ACGF au Centre Sportif de Vessy. Ses valeurs, Disciplina, União et Vitória, structurent un club à taille humaine ouvert à toutes les nationalités. Son site officiel en six langues et sa galerie de photos racontent une histoire centenaire toujours en mouvement. Le plus simple pour le connaître : venir à Vessy un dimanche.`;

// ---------------------------------------------------------------------------
// 4. Coûts du football amateur en Suisse romande
// ---------------------------------------------------------------------------

const faq4: BlogFaqItem[] = [
  {
    q: "Combien coûte une licence de football en Suisse ?",
    a: "La licence ASF est réglée par l'intermédiaire du club ; elle représente généralement quelques dizaines de francs par saison, parfois déjà incluse dans la cotisation.",
  },
  {
    q: "La cotisation est-elle la même dans tous les clubs ?",
    a: "Non : chaque club fixe librement sa cotisation ; les fourchettes de cet article sont des ordres de grandeur romands, pas des tarifs officiels.",
  },
  {
    q: "Peut-on payer la cotisation en plusieurs fois ?",
    a: "C'est une pratique courante dans les clubs amateurs ; demandez-le directement au club, qui trouve presque toujours une solution.",
  },
  {
    q: "Existe-t-il des réductions pour les familles ?",
    a: "Oui, de nombreux clubs accordent des réductions pour fratries ou deuxième membre d'une même famille ; les modalités varient d'un club à l'autre.",
  },
  {
    q: "Y a-t-il un essai avant de payer ?",
    a: "Oui : quelques entraînements d'essai gratuits avant tout engagement sont la norme dans le football amateur.",
  },
];

const content4: string = `Jouer au football amateur en Suisse romande coûte le plus souvent entre 300 et 800 CHF par saison pour un senior, cotisation annuelle, licence fédérale et équipement de base compris. Pour un junior, le budget est généralement plus bas. Les montants présentés ici sont des ordres de grandeur observés dans le football amateur romand — ils ne constituent pas une grille tarifaire officielle du FC APG 1921 (Association des Portugais de Genève, fondé le 1er juillet 1921), qui communique ses conditions sur demande.

## L'essentiel en bref

- Budget senior typique : environ 300 à 800 CHF par saison, tout compris.
- Trois postes de dépense : cotisation du club, licence via l'ASF, équipement personnel.
- Les juniors coûtent généralement moins cher que les seniors.
- Facilités de paiement et réductions (étudiants, familles, fratries) sont courantes dans les clubs.
- Chaque club fixe ses propres tarifs : demandez-les toujours directement.

## De quoi se compose le budget d'un joueur ?

Trois lignes dominent. La cotisation annuelle, fixée par le club, couvre les locations de terrains, les arbitres, le matériel et le fonctionnement général. La licence fédérale, délivrée par l'Association Suisse de Football (ASF), est réglée par l'intermédiaire du club ; elle représente le plus souvent quelques dizaines de francs et est parfois déjà incluse dans la cotisation. Reste l'équipement personnel — chaussures à crampons, protège-tibias, tenues d'entraînement — un poste surtout important la première année.

## Quels sont les coûts typiques par catégorie ?

Voici les fourchettes couramment observées dans le football amateur en Suisse romande. Il s'agit d'ordres de grandeur, pas de tarifs officiels :

| Catégorie | Cotisation annuelle (ordre de grandeur) | À prévoir en plus |
| --- | --- | --- |
| Juniors, écoles de foot | de 100 à 300 CHF | Équipement adapté à la croissance |
| Juniors compétition | de 150 à 400 CHF | Déplacements parfois plus longs |
| Seniors actifs | de 200 à 500 CHF | Licence ASF via le club |
| Vétérans et loisirs | de 150 à 400 CHF | Calendrier plus souple |

À ces cotisations s'ajoute l'équipement de base : comptez de 150 à 400 CHF la première année, nettement moins ensuite si le matériel dure. La licence ASF via le club ajoute le plus souvent quelques dizaines de francs, quand elle n'est pas déjà comprise dans la cotisation.

### Qu'est-ce que la cotisation finance concrètement ?

Les heures de terrain, l'arbitrage, l'affiliation à l'Association cantonale genevoise de football (ACGF), le matériel d'entraînement et la vie associative. Autrement dit : ce qui permet à un championnat d'exister chaque dimanche. Pour situer ces dépenses dans la pyramide du football genevois, [lisez notre présentation de l'ACGF](/blog/acgf-ligues-fonctionnement-football-genevois).

### Comment payer la cotisation ?

Le paiement en deux fois et les réductions pour familles, fratries ou étudiants sont des pratiques courantes dans les clubs amateurs romands. Dans tous les cas, la règle est la même : parlez de votre situation au club avant de renoncer.

## Comment limiter la facture ?

Commencez par un essai gratuit : quelques entraînements avant tout engagement sont la norme, et [notre guide pratique](/blog/rejoindre-club-football-geneve-guide) explique la démarche étape par étape. Réutilisez les chaussures et sacs de la saison précédente quand ils sont en bon état. Et si le budget est vraiment serré, dites-le : un club centenaire comme le nôtre préfère un joueur présent qu'un dossier vide. [Demandez-nous nos conditions actuelles](/contato) en toute simplicité.

## Questions fréquentes

${faqToMd(faq4)}

## En résumé

Jouer au football amateur en Suisse romande représente le plus souvent entre 300 et 800 CHF par saison pour un senior, licence et équipement compris, moins pour un junior. Les dépenses se répartissent entre cotisation du club, licence ASF réglée via le club et équipement personnel, avec des facilités de paiement courantes. Ces montants sont des ordres de grandeur : chaque club fixe ses tarifs. Au FC APG 1921, nous répondons personnellement à toute demande de conditions.`;

// ---------------------------------------------------------------------------
// 5. EURO féminin 2025 et héritage pour les clubs locaux
// ---------------------------------------------------------------------------

const faq5: BlogFaqItem[] = [
  {
    q: "Quand l'EURO féminin 2025 a-t-il eu lieu ?",
    a: "Du 2 au 27 juillet 2025, en Suisse, dans huit villes hôtes dont Genève.",
  },
  {
    q: "Qu'est-ce que WEURO-Legacy ?",
    a: "Le programme d'héritage de l'Association Suisse de Football, conçu pour transformer l'élan de l'EURO 2025 en croissance durable du football féminin.",
  },
  {
    q: "Genève a-t-elle accueilli des matchs de l'EURO 2025 ?",
    a: "Oui : Genève figurait parmi les villes hôtes, avec des rencontres disputées au Stade de Genève à Lancy.",
  },
  {
    q: "Qui est champion de Suisse féminin à Genève ?",
    a: "Le Servette Chênois, champion de Suisse en 2021 et en 2024.",
  },
  {
    q: "Comment une fille peut-elle débuter le football à Genève ?",
    a: "Par un club local : entraînement d'essai, licence via le club, puis championnat ; les clubs ACGF disposant d'une offre féminine sont les mieux placés.",
  },
  {
    q: "Le FC APG 1921 a-t-il une équipe féminine ?",
    a: "Notre équipe première évolue en 4e ligue ACGF ; pour l'offre féminine, nous orientons vers les clubs genevois concernés et suivons la dynamique WEURO-Legacy.",
  },
];

const content5: string = `L'EURO féminin de l'UEFA 2025, organisé en Suisse du 2 au 27 juillet 2025, a laissé au football helvétique un programme d'héritage baptisé WEURO-Legacy, porté par l'Association Suisse de Football (ASF). Son ambition : transformer l'engouement du tournoi en croissance durable du football féminin, des écoles de foot aux ligues nationales. À Genève, ville hôte dont les rencontres se sont jouées au Stade de Genève, les clubs régionaux — dont le FC APG 1921, Association des Portugais de Genève, fondé le 1er juillet 1921 — s'appuient sur cette dynamique, portée en amont par le Servette Chênois, champion de Suisse en 2021 et en 2024, pour accueillir de nouvelles joueuses.

## L'essentiel en bref

- L'EURO féminin 2025 s'est disputé en Suisse du 2 au 27 juillet 2025.
- L'ASF a construit un programme d'héritage dédié : WEURO-Legacy.
- Genève figurait parmi les villes hôtes, avec des matchs au Stade de Genève.
- Le Servette Chênois féminin a été champion de Suisse en 2021 et en 2024.
- Les clubs régionaux, dont le FC APG 1921, suivent cette dynamique pour ouvrir leurs portes à davantage de joueuses.

## Qu'est-ce que le programme WEURO-Legacy ?

WEURO-Legacy est le plan d'héritage de l'ASF issu de l'EURO 2025 : soutenir les clubs qui développent le football féminin, former les encadrantes et multiplier les offres de jeu pour les filles, des premières touches de ballon au championnat senior. L'idée directrice est simple : un tournoi à domicile ne vaut que s'il laisse derrière lui des joueuses, des bénévoles et des structures. Les informations officielles sont publiées par l'ASF sur son site football.ch.

## Pourquoi Genève était-elle déjà bien placée ?

Avant le tournoi, le football féminin genevois comptait déjà une référence nationale : le Servette Chênois, couronné champion de Suisse en 2021 puis en 2024. L'existence d'un club de premier plan dans le canton a donné aux jeunes joueuses des modèles proches, visibles dans les stades et les médias régionaux. À cela s'ajoute le rayonnement du Stade de Genève, à Lancy, enceinte d'environ 30 000 places qui a accueilli des rencontres de l'EURO et reste la vitrine du football cantonal.

## Que change-t-il pour les clubs locaux ?

Trois effets sont attendus. D'abord, davantage de filles qui poussent la porte des clubs au lendemain du tournoi, comme après chaque grande compétition jouée à domicile. Ensuite, une pression positive sur les clubs pour structurer leur offre féminine : créneaux d'entraînement, encadrement formé, calendriers dédiés. Enfin, une visibilité accrue du football féminin dans les médias régionaux. Pour comprendre où et contre qui jouent les clubs genevois, [suivez notre lecture du championnat ACGF](/blog/acgf-ligues-fonctionnement-football-genevois).

## Et au FC APG 1921 ?

Notre équipe première évolue en 4e ligue de l'Association cantonale genevoise de football (ACGF) au Centre Sportif de Vessy ; le football féminin s'y regarde autant qu'il s'y respecte. Pour les joueuses qui cherchent une équipe, nous orientons volontiers vers les clubs genevois qui proposent une offre féminine et nous suivons de près la dynamique WEURO-Legacy. [Notre guide pour rejoindre un club à Genève](/blog/rejoindre-club-football-geneve-guide) reste le bon point de départ, quel que soit votre profil — ou [écrivez-nous](/contato) directement.

## Questions fréquentes

${faqToMd(faq5)}

## En résumé

L'EURO féminin 2025, joué en Suisse du 2 au 27 juillet, a doté le football helvétique d'un héritage structuré avec le programme WEURO-Legacy de l'ASF. Genève, ville hôte avec des matchs au Stade de Genève, partait déjà bien placée grâce au Servette Chênois, champion de Suisse en 2021 et 2024. Pour les clubs régionaux, l'enjeu est de convertir cet intérêt en joueuses licenciées et en offre féminine solide. Le FC APG 1921 accompagne cette dynamique et oriente chaque demande vers la bonne porte.`;

// ---------------------------------------------------------------------------
// 6. Où voir des matchs de football à Genève le week-end
// ---------------------------------------------------------------------------

const faq6: BlogFaqItem[] = [
  {
    q: "Les matchs de l'ACGF sont-ils payants ?",
    a: "Le plus souvent, l'accès aux terrains régionaux est libre ; certains événements particuliers peuvent demander une petite participation.",
  },
  {
    q: "À quelle heure commencent les matchs du dimanche ?",
    a: "Le dimanche matin est le créneau classique du championnat amateur genevois ; les horaires exacts figurent dans le match center de l'ACGF.",
  },
  {
    q: "Où joue Servette FC ?",
    a: "Au Stade de Genève, à Lancy, l'enceinte majeure du canton avec environ 30 000 places.",
  },
  {
    q: "Où voir le FC APG 1921 jouer ?",
    a: "Au Centre Sportif de Vessy, lors des journées de championnat de 4e ligue ; le calendrier est publié chaque semaine.",
  },
  {
    q: "Qu'est-ce que la « troisième mi-temps » ?",
    a: "Le moment convivial d'après-match au club-house, où les équipes se retrouvent et où se nouent les amitiés qui font vivre le football amateur.",
  },
  {
    q: "Peut-on venir regarder un entraînement ?",
    a: "Oui : les séances des mardis et jeudis à 19h30 et du vendredi à 20h00 se regardent librement ; écrivez-nous pour être attendu.",
  },
];

const content6: string = `À Genève, le football du week-end se vit d'abord le dimanche matin sur les terrains de l'Association cantonale genevoise de football (ACGF) : l'entrée y est le plus souvent libre, l'ambiance familiale, et le championnat se joue de la 1re à la 5e ligue. Le FC APG 1921 — Association des Portugais de Genève, fondé le 1er juillet 1921 — y reçoit ses adversaires au Centre Sportif de Vessy. Pour le haut niveau, le Stade de Genève, à Lancy, accueille Servette FC, tandis que le Centre Sportif du Bout-du-Monde reste l'un des grands lieux du sport genevois. Calendriers et résultats se consultent via le match center de l'ACGF.

## L'essentiel en bref

- Le dimanche matin est le créneau roi du football amateur genevois, de la 1re à la 5e ligue ACGF.
- L'accès aux terrains régionaux est le plus souvent gratuit.
- Le Stade de Genève (Lancy), enceinte d'environ 30 000 places, accueille Servette FC.
- Le FC APG 1921 joue au Centre Sportif de Vessy en 4e ligue.
- Tous les calendriers figurent dans le match center de l'ACGF, sur acgf.ch.

## Le dimanche matin : le vrai rendez-vous

Le championnat amateur genevois vit le dimanche matin. Les terrains s'animent dans tout le canton, l'accès est généralement libre et chaque club reçoit selon le calendrier publié par l'ACGF. On y voit du football sincère et des affiches qui changent chaque semaine. C'est aussi le meilleur moyen de découvrir un club avant d'en rejoindre un : [notre article sur le fonctionnement de l'ACGF](/blog/acgf-ligues-fonctionnement-football-genevois) explique la pyramide des ligues.

## Où aller, quoi voir ?

Voici les lieux à connaître pour un week-end de football genevois :

| Lieu | On y voit | À quel moment |
| --- | --- | --- |
| Terrains de l'ACGF, dont le Centre Sportif de Vessy | Championnat amateur de la 1re à la 5e ligue | Dimanche matin |
| Stade de Genève (Lancy) | Servette FC, au premier échelon national | Week-end, selon le calendrier |
| Centre Sportif du Bout-du-Monde | Grands rendez-vous du sport genevois | Selon l'agenda des manifestations |
| Geneva Cup | Tournoi international de jeunes | Selon les éditions du tournoi |

Le Stade de Genève, à Lancy, est l'enceinte majeure du canton avec environ 30 000 places ; le Centre Sportif du Bout-du-Monde, avec ses nombreux terrains, accueille toute l'année des compétitions, et le Geneva Cup complète la carte avec son tournoi international de jeunes.

## Comment trouver les horaires des matchs ?

Deux réflexes : le match center de l'ACGF sur acgf.ch, qui recense scores, classements et calendriers, et les canaux des clubs, qui annoncent leurs matchs à domicile. Les horaires de Servette FC et des grands événements se trouvent sur les sites officiels concernés.

## La troisième mi-temps, l'âme du football amateur

On ne vient pas seulement voir un match : on vient partager un moment. À la fin des rencontres du dimanche, les club-houses ouvrent, les résultats circulent et les adversaires du jour redeviennent des voisins. Cette troisième mi-temps est l'une des bonnes raisons de venir à Vessy.

## Venez nous voir à Vessy

Le FC APG 1921 reçoit au Centre Sportif de Vessy lors des journées de championnat de 4e ligue ; les entraînements se regardent librement les mardis et jeudis à 19h30 et le vendredi à 20h00. [Regardez nos photos](/galerie) pour vous faire une idée de l'ambiance, [parcourez le blog](/blog), ou [écrivez-nous](/contato) pour être informé du prochain match à domicile.

## Questions fréquentes

${faqToMd(faq6)}

## En résumé

Pour voir du football à Genève le week-end, deux options se complètent : le dimanche matin sur les terrains de l'ACGF, gratuit et authentique, et les grandes enceintes comme le Stade de Genève où joue Servette FC. Le Centre Sportif du Bout-du-Monde et les tournois comme le Geneva Cup complètent la carte. Le FC APG 1921 y ajoute son antre de Vessy, où l'équipe reçoit en 4e ligue chaque dimanche de championnat. Consultez le match center de l'ACGF — et venez vivre la troisième mi-temps.`;

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "rejoindre-club-football-geneve-guide",
    title: "Comment rejoindre un club de football à Genève ? Le guide",
    excerpt:
      "Vous voulez jouer au football à Genève ? Essai, licence via un club, cotisation : le guide pratique du FC APG 1921 pour rejoindre un club genevois.",
    tag: "club",
    cover: "/uploads/club/hero-team.webp",
    sourceUrl: "",
    keywords:
      "rejoindre club football Genève, licence football Genève, essai entraînement football Genève, cotisation football amateur, FC APG 1921 recrutement, football amateur Genève, ACGF, club portugais Genève",
    author: "FC APG 1921",
    faq: faq1,
    publishedAt: "2026-08-25T08:00:00.000Z",
    content: content1,
  },
  {
    slug: "acgf-ligues-fonctionnement-football-genevois",
    title: "Football amateur à Genève : comment fonctionne l'ACGF ?",
    excerpt:
      "L'Association cantonale genevoise de football organise les ligues 1re à 5e. Comprendre la hiérarchie, le calendrier du dimanche et la place du FC APG 1921.",
    tag: "regional",
    cover: "/uploads/gallery/gallery-03.webp",
    sourceUrl: "https://www.acgf.ch",
    keywords:
      "ACGF, Association cantonale genevoise de football, ligues football Genève, 1re à 5e ligue, match dimanche matin Genève, match center ACGF, 4e ligue, FC APG 1921, football amateur Genève, ASF",
    author: "FC APG 1921",
    faq: faq2,
    publishedAt: "2026-09-01T09:00:00.000Z",
    content: content2,
  },
  {
    slug: "fc-apg-1921-histoire-club-portugais-geneve",
    title: "FC APG 1921 : l'histoire d'un club portugais à Genève",
    excerpt:
      "Fondé le 1er juillet 1921, le FC APG 1921 — Association des Portugais de Genève — évolue en 4e ligue ACGF et s'entraîne à Vessy. Découvrez son histoire.",
    tag: "club",
    cover: "/uploads/club/poster-crest-team.webp",
    sourceUrl: "",
    keywords:
      "FC APG 1921, Association des Portugais de Genève, club portugais Genève, histoire club football Genève, Centre Sportif de Vessy, 4e ligue ACGF, Disciplina União Vitória, communauté portugaise Genève",
    author: "FC APG 1921",
    faq: faq3,
    publishedAt: "2026-09-05T09:00:00.000Z",
    content: content3,
  },
  {
    slug: "cout-licence-football-suisse-romande",
    title: "Combien coûte jouer au football amateur en Suisse romande ?",
    excerpt:
      "Cotisation, licence, équipement : combien coûte une saison de football amateur en Suisse romande ? Nos ordres de grandeur par catégorie, sans surprise.",
    tag: "regional",
    cover: "/uploads/gallery/gallery-10.webp",
    sourceUrl: "",
    keywords:
      "coût licence football Suisse, cotisation club football Genève, prix football amateur, combien coûte football Suisse romande, équipement football junior, licence ASF, FC APG 1921 cotisation, budget joueur amateur",
    author: "FC APG 1921",
    faq: faq4,
    publishedAt: "2026-09-12T08:30:00.000Z",
    content: content4,
  },
  {
    slug: "euro-2025-suisse-heritage-football-local",
    title: "EURO féminin 2025 en Suisse : quel héritage pour les clubs ?",
    excerpt:
      "L'EURO féminin 2025 a marqué la Suisse. WEURO-Legacy, essor du football féminin, Servette Chênois : ce que le tournoi change pour les clubs genevois.",
    tag: "communaute",
    cover: "/uploads/gallery/gallery-16.webp",
    sourceUrl: "https://www.football.ch",
    keywords:
      "EURO féminin 2025, EURO 2025 Suisse, WEURO-Legacy, football féminin Suisse, Servette Chênois, ASF, Stade de Genève, football féminin Genève, héritage EURO 2025, jeunes joueuses",
    author: "FC APG 1921",
    faq: faq5,
    publishedAt: "2026-09-19T10:00:00.000Z",
    content: content5,
  },
  {
    slug: "ou-voir-matchs-football-geneve-weekend",
    title: "Où voir des matchs de football à Genève le week-end ?",
    excerpt:
      "Dimanche matin sur les terrains de l'ACGF, stades majeurs au Bout-du-Monde : où voir du football à Genève le week-end, et pourquoi Vessy vaut le détour.",
    tag: "match-day",
    cover: "/uploads/club/banner-wide-1.webp",
    sourceUrl: "https://www.acgf.ch",
    keywords:
      "match football Genève, dimanche matin football, ACGF calendrier, Stade de Genève, Servette FC, Centre Sportif de Vessy, FC APG 1921, Bout-du-Monde, week-end football Genève",
    author: "FC APG 1921",
    faq: faq6,
    publishedAt: "2026-10-02T08:00:00.000Z",
    content: content6,
  },
];
