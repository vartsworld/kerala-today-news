import { useEffect } from "react";
import SEO from "@/components/SEO";
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

  return (
    <main>
      <SEO 
        title="Kerala Today News — Breaking News & Editorial Excellence" 
        description="Your trusted source for breaking news, in-depth editorials, and comprehensive media coverage. Stay informed with Kerala Today News's latest updates and expert analysis." 
        canonical="/" 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "Kerala Today News",
          "url": "https://keralatodaynews.com",
          "logo": "https://keralatodaynews.com/lovable-uploads/kerala-today-logo.png",
          "sameAs": ["https://facebook.com/KeralaTodayNews"],
          "description": "Breaking news, in-depth editorials, and comprehensive media coverage from Kerala Today News.",
          "foundingDate": "2020"
        }} 
      />

      <section id="hero" aria-label="Hero banner" className="relative">
        {/* Hero image for all screens */}
        <img 
          src="/lovable-uploads/kerala-today-hero.png" 
          alt="Kerala Today News - Your Daily News Source" 
          loading="eager" 
          className="h-[40vh] md:h-[50vh] lg:h-[60vh] w-full object-cover" 
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </section>

      <section aria-labelledby="news-home" className="container mx-auto py-8 md:py-12">
        <header className="mb-6">
          <h1 id="news-home" className="text-3xl md:text-4xl font-bold">Kerala Today News</h1>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Your Daily News Source</p>
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
    </main>
  );
};

export default Index;
