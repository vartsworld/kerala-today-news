import SEO from "@/components/SEO";
import PublishedEditorials from "@/components/PublishedEditorials";
import StickyContactCTA from "@/components/StickyContactCTA";

const Editorial = () => {
  return (
    <main className="container mx-auto py-10">
      <SEO
        title="Editorial — Kerala Today News"
        description="Opinion and analysis from the Kerala Today News editorial desk. Expert commentary on current events, politics, and society from our experienced editorial team."
        canonical="/editorial"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Editorial Section - Kerala Today News",
          "description": "Editorial opinions and analysis from Kerala Today News",
          "url": "https://www.keralatoday.news/editorial",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Kerala Today News",
            "url": "https://www.keralatoday.news"
          }
        }}
      />
      <PublishedEditorials />
      <StickyContactCTA />
    </main>
  );
};

export default Editorial;
