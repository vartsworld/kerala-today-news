import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface FeedItem {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: { type: string; url?: string; thumbnail_url?: string }[];
}

const FacebookNewsReels = () => {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

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
          body: JSON.stringify({ limit: 15 }),
        });

        if (!mounted) return;

        if (!response.ok) {
          setError(`HTTP Error: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (data?.error) {
          console.error("Facebook reels error:", data.message);
          setItems([]); // Empty items so it doesn't show
        } else {
          // Filter posts that have images for better visual reels
          const postsWithImages = (data?.data ?? []).filter((item: FeedItem) =>
            item.attachments && item.attachments.some(att => att.thumbnail_url || att.url)
          ).slice(0, 8);
          setItems(postsWithImages);
        }
      } catch (err: any) {
        if (mounted) {
          console.error("Fetch error:", err);
          setError(err.message);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!api || !isPlaying) return;

    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 4000); // Change slide every 4 seconds
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, isPlaying]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (api && isPlaying) {
      intervalRef.current = setInterval(() => {
        api.scrollNext();
      }, 4000);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (error || !items || items.length === 0) return null;

  return (
    <section id="reels" className="container mx-auto px-4 py-8 sm:py-12">
      <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">News Reels</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Visual highlights from our latest coverage</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={togglePlayPause}
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
      </header>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map(item => {
              const img = item.attachments?.find(a => a.thumbnail_url || a.url);
              const title = item.message?.split("\n")[0]?.slice(0, 60) || "News update";
              const slug = `facebook-${item.id}`;

              return (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <article className="rounded-lg border bg-card overflow-hidden hover-scale">
                    <Link to={`/article/${slug}`} aria-label={`Read: ${title}`}>
                      <AspectRatio ratio={9 / 16}>
                        <div
                          className="relative h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-105 group"
                          style={{
                            backgroundImage: img ? `url(${img.thumbnail_url || img.url})` : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/10" />

                          <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                            <a
                              href={item.permalink_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transform transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
                            </a>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 animate-fade-in">
                            <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-3 text-foreground drop-shadow-lg">
                              {title}
                            </p>
                            <span className="text-xs text-muted-foreground mt-1 sm:mt-2 block drop-shadow-md">
                              {new Date(item.created_time).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </AspectRatio>
                    </Link>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <CarouselPrevious aria-label="Previous reels" className="h-8 w-8 sm:h-10 sm:w-10" />
              <CarouselNext aria-label="Next reels" className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Auto-play {isPlaying ? "enabled" : "paused"}
              </span>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default FacebookNewsReels;