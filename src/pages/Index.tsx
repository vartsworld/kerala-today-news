import { useEffect } from "react";
import SEO from "@/components/SEO";
import heroImage from "@/assets/hero-achayans.jpg";
import ContactBanner from "@/components/ContactBanner";
import AboutSection from "@/components/AboutSection";
import LatestEditorial from "@/components/LatestEditorial";
import BreakingNewsTicker from "@/components/BreakingNewsTicker";
import FacebookFeedSection from "@/components/FacebookFeedSection";
import FacebookLatestPosts from "@/components/FacebookLatestPosts";
import FacebookPopularPosts from "@/components/FacebookPopularPosts";
import FacebookNewsReels from "@/components/FacebookNewsReels";
import FacebookFeaturedPost from "@/components/FacebookFeaturedPost";
import PublishedEditorials from "@/components/PublishedEditorials";
const Index = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--pointer-x", `${e.clientX}px`);
      root.style.setProperty("--pointer-y", `${e.clientY}px`);
    };
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener("pointermove", handler);
    }
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  return <main>
      <SEO 
        title="Achayans Media — Breaking News & Editorial Excellence" 
        description="Your trusted source for breaking news, in-depth editorials, and comprehensive media coverage. Stay informed with Achayans Media's latest updates and expert analysis." 
        canonical="/" 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "Achayans Media",
          "url": "https://achayansmedia.com",
          "logo": "https://achayansmedia.com/lovable-uploads/685a77f1-54e3-4b5c-9510-e9a4eee98537.png",
          "sameAs": ["https://facebook.com/AchayansMedia"],
          "description": "Breaking news, in-depth editorials, and comprehensive media coverage from Achayans Media.",
          "foundingDate": "2020",
          "memberOf": {
            "@type": "Organization",
            "name": "Journalist & Media Association"
          }
        }} 
      />

      <section id="hero" aria-label="Hero banner" className="relative">
        {/* Mobile hero image */}
        <img src="/lovable-uploads/0340b869-36a3-4c6a-83f7-941130a1f0a5.png" alt="Achayans Media - Journalist & Media Association Member" loading="eager" className="md:hidden h-[40vh] w-full object-cover" />
        {/* Desktop hero image */}
        <img src="/lovable-uploads/9d34e3b5-57eb-46b2-90e4-92e86d893489.png" alt="Achayans Media hero banner with newspapers collage and brand mark" loading="eager" className="hidden md:block h-[50vh] w-full object-cover lg:h-[60vh]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </section>

      <section aria-labelledby="news-home" className="container mx-auto py-8 md:py-12">
        <header className="mb-6">
          <h1 id="news-home" className="text-3xl md:text-4xl font-bold">Achayans Media News</h1>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Journalist & Media Associate Member</p>
        </header>
        <div className="grid gap-4 lg:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3 col-span-full order-2 lg:order-1">
            <FacebookLatestPosts />
          </div>

          <div className="lg:col-span-6 col-span-full order-1 lg:order-2">
            <FacebookFeaturedPost />
          </div>

          <aside className="lg:col-span-3 col-span-full order-3" aria-label="Latest editorials">
            <h2 className="text-lg md:text-xl font-bold mb-3">Editorial</h2>
            <div className="space-y-3">
              <LatestEditorial />
            </div>
          </aside>
        </div>
      </section>

      <BreakingNewsTicker />

      <ContactBanner />

      <FacebookPopularPosts />

      <FacebookNewsReels />

      <FacebookFeedSection />


      <section className="container mx-auto py-12">
        <PublishedEditorials 
          limit={4} 
          showTitle={true}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
      </section>

      <AboutSection />
    </main>;
};
export default Index;