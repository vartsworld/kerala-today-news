import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: {type: string;url?: string;thumbnail_url?: string;}[];
}

const FacebookLatestPosts = () => {
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.functions.invoke("facebook-feed", { body: { limit: 5 } });
      if (!mounted) return;
      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setItems(data?.data ?? []);
      }
    })();
    return () => {mounted = false;};
  }, []);

  if (error) {
    return (
      <section className="lg:col-span-3" aria-label="Fresh stories">
        <h2 className="text-xl font-bold mb-3">Fresh stories</h2>
<<<<<<< HEAD
        <p className="text-sm text-muted-foreground">Unable to load latest posts</p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">Error: {error}</p>
      </section>
    );
=======
        <p className="text-sm text-muted-foreground">Unable to load latest post</p>
      </section>);

>>>>>>> 30ee260cd5afd77979845ccc65b659003a969686
  }

  if (!items) {
    return (
      <section className="lg:col-span-3" aria-label="Fresh stories">
        <h2 className="text-xl font-bold mb-3">Fresh stories</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) =>
          <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          )}
        </div>
      </section>);

  }

  return (
    <section className="lg:col-span-3 col-span-full" aria-label="Fresh stories">
      <h2 className="text-lg md:text-xl font-bold mb-3">Fresh stories</h2>
      <ul className="space-y-3 md:space-y-4">
        {items.map((item) => {
          const title = item.message?.split("\n")[0]?.slice(0, 100) || "Latest update";
          const slug = `facebook-${item.id}`;
          return (
            <li key={item.id}>
              <Link
                to={`/article/${slug}`}
                className="story-link leading-snug hover:text-primary transition-colors text-sm md:text-base">

                {title}
              </Link>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(item.created_time).toLocaleDateString()}
              </div>
            </li>);

        })}
      </ul>
    </section>);

};

export default FacebookLatestPosts;