import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
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
const FacebookFeaturedPost = () => {
  const [featuredPost, setFeaturedPost] = useState<FeedItem | null>(null);
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
          body: JSON.stringify({ limit: 10 }),
        });

        if (!mounted) return;

        if (!response.ok) {
          setError(`HTTP Error: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (data?.error) {
          console.error("Facebook featured error:", data.message);
          setError(data.message || data.error);
        } else {
          // Find the first post with an image for featured display
          const postsWithImages = (data?.data ?? []).filter((item: FeedItem) => item.attachments && item.attachments.some(att => att.thumbnail_url || att.url));
          setFeaturedPost(postsWithImages[0] || (data?.data ?? [])[0] || null);
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
  if (!featuredPost && !error) {
    return (
      <article className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] animate-pulse">
          <div className="absolute inset-0 bg-muted" />
          <div className="absolute bottom-4 left-4 right-4 space-y-3">
            <div className="h-8 bg-background/20 rounded-md w-3/4" />
            <div className="h-4 bg-background/20 rounded-md w-1/2" />
          </div>
        </div>
      </article>
    );
  }

  if (error || !featuredPost) {
    return <article className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute left-4 top-4">
          <Badge>Breaking</Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl md:text-3xl font-extrabold">Latest News from Kerala Today</h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground line-clamp-2">
            Stay tuned for the latest updates and breaking news.
          </p>
          {error && <p className="text-[10px] text-muted-foreground/30 mt-2">Error: {error}</p>}
        </div>
      </div>
    </article>;
  }
  const img = featuredPost.attachments?.find(a => a.thumbnail_url || a.url);
  const title = featuredPost.message?.split("\n")[0]?.slice(0, 120) || "Latest Update";
  const excerpt = featuredPost.message?.slice(0, 200) || "";
  const slug = `facebook-${featuredPost.id}`;
  return <article className="relative overflow-hidden rounded-lg border bg-card shadow-sm">
    <Link to={`/article/${slug}`}>
      <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] group">
        {img && <img src={img.thumbnail_url || img.url} alt={`${title} - Kerala Today News`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/10" />

        {featuredPost.attachments?.some(a => a.type?.includes("video")) && (
          <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
            <a
              href={featuredPost.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary/90 text-primary-foreground p-3 sm:p-5 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="h-8 w-8 sm:h-12 sm:w-12 fill-current" />
            </a>
          </div>
        )}

        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <Badge className="bg-primary/90 backdrop-blur-sm text-xs sm:text-sm">Breaking</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground drop-shadow-lg leading-tight">
            {title}
          </h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-2 drop-shadow-md">
            {excerpt}
          </p>
          <div className="mt-1 sm:mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-background/20 backdrop-blur-sm px-2 py-1 rounded text-xs">Facebook</span>
            <span className="text-xs">{new Date(featuredPost.created_time).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  </article>;
};
export default FacebookFeaturedPost;