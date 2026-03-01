import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "organization";
  structuredData?: Record<string, any>;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

const BASE_URL = "https://www.keralatoday.news";
const SITE_NAME = "Kerala Today News";
const DEFAULT_IMAGE = `${BASE_URL}/lovable-uploads/kerala-today-logo.png`;

const MASTER_KEYWORDS = [
  "Kerala Today News",
  "Kerala news today",
  "breaking news Kerala",
  "Malayalam news",
  "Kerala latest news",
  "Kerala updates",
  "Kerala editorials",
  "Kerala political news",
  "Kerala society news",
  "Kerala current affairs",
  "Kerala news live",
  "today Kerala news",
  "Kerala news online",
  "Kerala daily news",
  "Achayans Media",
  "Kerala journalism",
  "Kerala media coverage",
  "Attingal news",
  "Thiruvananthapuram news",
  "Kerala district news",
  "Kerala government news",
  "Kerala economy news",
  "Kerala sports news",
  "Kerala entertainment news",
  "Mollywood news",
  "Kerala education news",
  "Kerala health news",
  "Kerala technology news",
  "NRI Kerala news",
  "Pravasi Malayali news",
  "കേരള വാർത്തകൾ",
  "മലയാളം വാർത്ത",
  "കേരള ന്യൂസ്",
];

const buildBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    ...(item.href ? { "item": `${BASE_URL}${item.href}` } : {}),
  })),
});

export const SEO = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  structuredData,
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  breadcrumbs,
  noindex = false,
}: SEOProps) => {
  const seoImage = image || DEFAULT_IMAGE;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const allKeywords = [...new Set([...MASTER_KEYWORDS, ...keywords])].join(", ");

  // Auto-generate article structured data if not provided
  const autoStructuredData = type === "article" && !structuredData ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description || "",
    "image": seoImage,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Organization",
      "name": author || SITE_NAME,
      "url": BASE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_IMAGE,
        "width": 512,
        "height": 512,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullCanonical,
    },
  } : structuredData;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Hreflang for multilingual audience */}
      <link rel="alternate" hrefLang="en" href={fullCanonical} />
      <link rel="alternate" hrefLang="ml" href={fullCanonical} />
      <link rel="alternate" hrefLang="x-default" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="ml_IN" />

      {/* Article-specific meta */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && (
        <meta property="article:section" content="News" />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@KeralaTodayNews" />
      <meta name="twitter:creator" content="@KeralaTodayNews" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex
          ? "noindex, nofollow"
          : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Author & Publisher */}
      <meta name="author" content={author || SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="news_keywords" content={allKeywords} />

      {/* Geo targeting */}
      <meta name="geo.region" content="IN-KL" />
      <meta name="geo.placename" content="Kerala" />
      <meta name="content-language" content="en, ml" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

      {/* Structured data */}
      {autoStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(autoStructuredData)}
        </script>
      )}

      {/* Breadcrumb schema */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema(breadcrumbs))}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
