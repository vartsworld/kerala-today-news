import SEO from "@/components/SEO";
import PublishedEditorials from "@/components/PublishedEditorials";
import StickyContactCTA from "@/components/StickyContactCTA";

const Editorial = () => {
  return (
    <main className="container mx-auto py-10">
      <SEO
        title="Editorials & Opinion — Kerala Today News"
        description="Read expert editorials and opinion pieces on Kerala politics, society, culture, and current affairs from Kerala Today News editorial desk."
        canonical="/editorial"
        type="website"
        keywords={["Kerala editorial", "Kerala opinion", "Kerala political analysis", "Kerala commentary"]}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Editorial" },
        ]}
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
