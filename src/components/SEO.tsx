import { Helmet } from "react-helmet-async";

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
}

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
}: SEOProps) => {
  const siteName = "Kerala Today News";
  const baseUrl = "https://keralatodaynews.com";
  const defaultImage = `${baseUrl}/lovable-uploads/kerala-today-logo.png`;
  const seoImage = image || defaultImage;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const defaultKeywords = ["Kerala Today News", "breaking news", "editorials", "Kerala news", "journalism", "media coverage"];
  const allKeywords = [...defaultKeywords, ...keywords].join(", ");
  
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_US" />
      
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

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@KeralaTodayNews" />
      <meta name="twitter:creator" content="@KeralaTodayNews" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content={author || siteName} />
      <meta name="publisher" content={siteName} />
      
      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
