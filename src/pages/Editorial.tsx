import SEO from "@/components/SEO";
import PublishedEditorials from "@/components/PublishedEditorials";

const Editorial = () => {
  return (
    <main className="container mx-auto py-10">
      <SEO
        title="Editorial — Achayans Media"
        description="Opinion and analysis from the Achayans Media editorial desk. Expert commentary on current events, politics, and society from our experienced editorial team."
        canonical="/editorial"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Editorial Section - Achayans Media",
          "description": "Editorial opinions and analysis from Achayans Media",
          "url": "https://achayansmedia.com/editorial",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Achayans Media",
            "url": "https://achayansmedia.com"
          }
        }}
      />
      <PublishedEditorials />
    </main>
  );
};

export default Editorial;
