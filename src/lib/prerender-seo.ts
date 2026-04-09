const BASE_URL = "https://keralatoday.news";
const SITE_NAME = "Kerala Today News";
const DEFAULT_IMAGE = `${BASE_URL}/lovable-uploads/kerala-today-logo.png`;

export interface PrerenderRoute {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  type?: "website" | "article";
  noindex?: boolean;
  image?: string;
  structuredData?: Array<Record<string, unknown>>;
}

const buildBreadcrumbSchema = (items: Array<{ name: string; href?: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
  })),
});

export const prerenderRoutes: PrerenderRoute[] = [
  {
    path: "/",
    title: "Kerala Today News — Breaking News, Editorials & Live Updates",
    description:
      "Kerala Today News delivers breaking news, in-depth editorials, political analysis, and live updates from all 14 districts of Kerala. Your trusted Malayalam & English news source.",
    keywords: [
      "Kerala Today News",
      "Kerala Today",
      "Kerala breaking news today",
      "Malayalam news live",
      "Kerala latest news",
      "Thiruvananthapuram news",
      "Attingal news",
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        name: SITE_NAME,
        alternateName: ["KTN", "Kerala Today", "കേരള ടുഡേ ന്യൂസ്"],
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_IMAGE,
          width: 512,
          height: 512,
        },
        sameAs: ["https://facebook.com/KeralaTodayNews"],
        description:
          "Kerala Today News delivers breaking news, in-depth editorials, and comprehensive media coverage from Kerala.",
        foundingDate: "2020",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Attingal",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: BASE_URL,
      },
    ],
  },
  {
    path: "/editorial",
    title: "Editorials & Opinion — Kerala Today News",
    description:
      "Read expert editorials and opinion pieces on Kerala politics, society, culture, and current affairs from Kerala Today News editorial desk.",
    keywords: [
      "Kerala editorial",
      "Kerala opinion",
      "Kerala political analysis",
      "Kerala commentary",
      "Kerala Today editorial",
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Editorial Section - Kerala Today News",
        description: "Editorial opinions and analysis from Kerala Today News",
        url: `${BASE_URL}/editorial`,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      buildBreadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Editorial" },
      ]),
    ],
  },
  {
    path: "/about",
    title: "About Us — Kerala Today News",
    description:
      "Learn about Kerala Today News — a premier digital news platform delivering accurate, unbiased journalism and comprehensive coverage from all 14 districts of Kerala.",
    keywords: ["about Kerala Today News", "Kerala news team", "Kerala journalism"],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Kerala Today News",
        url: `${BASE_URL}/about`,
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      buildBreadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "About Us" },
      ]),
    ],
  },
  {
    path: "/contact",
    title: "Contact Us — Kerala Today News",
    description:
      "Contact Kerala Today News for news tips, advertising, feedback, or business inquiries. Reach us for editorial and media support in Kerala.",
    keywords: ["contact Kerala Today News", "Kerala news tips", "Kerala news advertising"],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Kerala Today News",
        url: `${BASE_URL}/contact`,
        mainEntity: {
          "@type": "Organization",
          name: SITE_NAME,
          telephone: "+918547363646",
          email: "keralatodaychannel24x7@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Navami Communication, Nalini Building, Near Erattappana Temple, Chirayinkeezhu Road",
            addressLocality: "Attingal",
            postalCode: "695101",
            addressRegion: "Kerala",
            addressCountry: "IN",
          },
        },
      },
      buildBreadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Contact Us" },
      ]),
    ],
  },
  {
    path: "/terms",
    title: "Terms & Conditions — Kerala Today News",
    description: "Read the terms and conditions for using Kerala Today News.",
    keywords: ["Kerala Today terms", "Kerala news terms and conditions", "Kerala Today policies"],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Terms & Conditions — Kerala Today News",
        url: `${BASE_URL}/terms`,
      },
      buildBreadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Terms & Conditions" },
      ]),
    ],
  },
  {
    path: "/privacy",
    title: "Privacy Policy — Kerala Today News",
    description:
      "Understand how Kerala Today News collects, uses, and protects your personal information.",
    keywords: ["Kerala Today privacy policy", "Kerala news privacy", "Kerala Today data policy"],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Privacy Policy — Kerala Today News",
        url: `${BASE_URL}/privacy`,
      },
      buildBreadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Privacy Policy" },
      ]),
    ],
  },
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripManagedSeo = (html: string) => {
  const patterns = [
    /<title>[\s\S]*?<\/title>/gi,
    /<meta[^>]+name=["']description["'][^>]*>/gi,
    /<meta[^>]+name=["']keywords["'][^>]*>/gi,
    /<meta[^>]+name=["']robots["'][^>]*>/gi,
    /<meta[^>]+name=["']googlebot["'][^>]*>/gi,
    /<meta[^>]+name=["']news_keywords["'][^>]*>/gi,
    /<meta[^>]+name=["']author["'][^>]*>/gi,
    /<meta[^>]+name=["']publisher["'][^>]*>/gi,
    /<link[^>]+rel=["']canonical["'][^>]*>/gi,
    /<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/gi,
    /<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi,
  ];

  return patterns.reduce((result, pattern) => result.replace(pattern, ""), html);
};

const buildHeadMarkup = (route: PrerenderRoute) => {
  const canonical = `${BASE_URL}${route.path === "/" ? "" : route.path}`;
  const image = route.image || DEFAULT_IMAGE;
  const keywords = route.keywords.join(", ");
  const robots = route.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const structuredDataMarkup = (route.structuredData || [])
    .map((entry) => `<script type="application/ld+json">${JSON.stringify(entry)}</script>`)
    .join("\n");

  return `
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <meta name="author" content="${SITE_NAME}" />
  <meta name="publisher" content="${SITE_NAME}" />
  <meta name="robots" content="${robots}" />
  <meta name="googlebot" content="${route.noindex ? "noindex, nofollow" : "index, follow"}" />
  <meta name="news_keywords" content="${escapeHtml(keywords)}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="ml" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(route.title)}" />
  <meta property="og:description" content="${escapeHtml(route.description)}" />
  <meta property="og:type" content="${route.type === "article" ? "article" : "website"}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(route.title)}" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:locale:alternate" content="ml_IN" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@KeralaTodayNews" />
  <meta name="twitter:creator" content="@KeralaTodayNews" />
  <meta name="twitter:title" content="${escapeHtml(route.title)}" />
  <meta name="twitter:description" content="${escapeHtml(route.description)}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${escapeHtml(route.title)}" />
  ${structuredDataMarkup}`;
};

export const injectPrerenderedSeo = (html: string, route: PrerenderRoute) => {
  const cleanedHtml = stripManagedSeo(html);
  return cleanedHtml.replace("</head>", `${buildHeadMarkup(route)}\n</head>`);
};
