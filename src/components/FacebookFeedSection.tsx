import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import NewsCard from "@/components/NewsCard";

interface FeedItem {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: {
    type: string;
    url?: string;
    thumbnail_url?: string;
  }[];
}

const FacebookFeedSection = () => {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/facebook-feed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ limit: 20 }),
        });

        if (!mounted) return;

        if (!response.ok) {
          setError(`HTTP Error: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (data?.error) {
          console.error("Facebook feed section error:", data.message);
          setError(data.message || data.error);
        } else {
          setItems(data?.data ?? []);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Fetch error:", err);
          setError(err.message);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <section className="container mx-auto py-12">
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">From Facebook</h2>
          <p className="text-muted-foreground">We couldn't load the feed right now.</p>
        </header>
        <p className="text-sm text-muted-foreground">{error}</p>
      </section>
    );
  }

  if (!items) {
    return (
      <section className="container mx-auto py-12">
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">From Facebook</h2>
          <p className="text-muted-foreground">Loading latest posts…</p>
        </header>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="container mx-auto py-12">
      <header className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Kerala Today News</h2>
        <p className="text-sm sm:text-base text-muted-foreground">All the latest updates from Kerala Today News</p>
      </header>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map(post => {
            const img = post.attachments?.find(a => a.thumbnail_url || a.url);
            const title = post.message?.split("\n")[0]?.slice(0, 80) || "Facebook post";
            const excerpt = post.message?.slice(0, 160) || "";
            const isVideo = post.attachments?.some(a => a.type?.includes("video")) || false;
            return (
              <CarouselItem key={post.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <NewsCard
                  title={title}
                  excerpt={excerpt}
                  image={img?.thumbnail_url || img?.url}
                  date={post.created_time}
                  href={post.permalink_url}
                  source="Facebook"
                  isVideo={isVideo}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mt-3 sm:mt-4 flex items-center justify-end gap-2">
          <CarouselPrevious aria-label="Previous posts" className="h-8 w-8 sm:h-10 sm:w-10" />
          <CarouselNext aria-label="Next posts" className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      </Carousel>
    </section>
  );
};

export default FacebookFeedSection;
