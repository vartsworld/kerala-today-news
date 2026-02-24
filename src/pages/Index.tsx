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
          "url": "https://www.keralatoday.news",
          "logo": "https://www.keralatoday.news/lovable-uploads/kerala-today-logo.png",
          "sameAs": ["https://facebook.com/KeralaTodayNews"],
          "description": "Breaking news, in-depth editorials, and comprehensive media coverage from Kerala Today News.",
          "foundingDate": "2020"
        }} />


      <section id="hero" aria-label="Hero banner" className="relative">
        {/* Hero image - responsive aspect ratio for different screens */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/8] overflow-hidden">
          <img
            src="/lovable-uploads/kerala-today-hero.png"
            alt="Kerala Today News - Your Daily News Source"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover object-center sm:object-center object-[center_30%]" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Hero content overlay for larger screens */}
          <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="container mx-auto">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground drop-shadow-lg">
                Kerala Today News
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground drop-shadow-md mt-1">Your Daily News Source

              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="latest" aria-labelledby="news-home" className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Mobile-only header */}
        <header className="mb-4 sm:mb-6 md:hidden">
          <h1 id="news-home" className="text-2xl sm:text-3xl font-bold">Kerala Today News</h1>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Your Daily News Source</p>
        </header>

        {/* Desktop header - hidden on mobile since it's in hero */}
        <header className="mb-6 hidden md:block">
          <h1 id="news-home" className="sr-only">Kerala Today News</h1>
        </header>

        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          {/* Featured post - full width on mobile, center on desktop */}
          <div className="lg:col-span-6 order-1">
            <FacebookFeaturedPost />
          </div>

          {/* Latest posts - side column on desktop */}
          <div className="lg:col-span-3 order-2 lg:order-first">
            <FacebookLatestPosts />
          </div>

          {/* Editorial section */}
          <aside className="lg:col-span-3 order-3" aria-label="Latest editorials">
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

      <section className="container mx-auto px-4 py-8 sm:py-12">
        <PublishedEditorials
          limit={4}
          showTitle={true}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />

      </section>

      <AboutSection />
    </main>);

};

export default Index;