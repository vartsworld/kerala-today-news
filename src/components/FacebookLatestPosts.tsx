import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: { type: string; url?: string; thumbnail_url?: string }[];
}

const FacebookLatestPosts = () => {
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
          body: JSON.stringify({ limit: 5 }),
        });

        if (!mounted) return;

        if (!response.ok) {
          setError(`HTTP Error: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (data?.error) {
          console.error("Facebook feed error:", data.message);
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
    return () => { mounted = false; };
  }, []);

  if (error) {
    return (
      <section className="lg:col-span-3" aria-label="Fresh stories">
        <h2 className="text-xl font-bold mb-3">Fresh stories</h2>
        <p className="text-sm text-muted-foreground">Unable to load latest posts</p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">Error: {error}</p>
      </section>
    );
  }

  if (!items) {
    return (
      <section className="lg:col-span-3" aria-label="Fresh stories">
        <h2 className="text-xl font-bold mb-3">Fresh stories</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-3 col-span-full" aria-label="Fresh stories">
      <h2 className="text-lg md:text-xl font-bold mb-3">Fresh stories</h2>
      <ul className="space-y-3 md:space-y-4">
        {items.map(item => {
          const title = item.message?.split("\n")[0]?.slice(0, 100) || "Latest update";
          const slug = `facebook-${item.id}`;
          return (
            <li key={item.id}>
              <Link
                to={`/article/${slug}`}
                className="story-link leading-snug hover:text-primary transition-colors text-sm md:text-base"
              >
                {title}
              </Link>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(item.created_time).toLocaleDateString()}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FacebookLatestPosts;