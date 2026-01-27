import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "organization";
  structuredData?: Record<string, any>;
}

export const SEO = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  structuredData,
}: SEOProps) => {
  const siteName = "Kerala Today News";
  const baseUrl = "https://keralatodaynews.com";
  const defaultImage = `${baseUrl}/lovable-uploads/kerala-today-logo.png`;
  const seoImage = image || defaultImage;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={fullCanonical} />
      
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@KeralaTodayNews" />
      <meta name="twitter:creator" content="@KeralaTodayNews" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={seoImage} />
      
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
