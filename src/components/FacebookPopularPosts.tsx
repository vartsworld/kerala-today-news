import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Masonry from "react-masonry-css";
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
const FacebookPopularPosts = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const loadPosts = async (offset: number = 0) => {
    const isInitialLoad = offset === 0;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("facebook-feed", {
        body: {
          limit: 6,
          offset
        }
      });
      if (error) {
        console.error(error);
        setError(error.message);
        return;
      }

      const payload = data as any;
      if (payload?.error) {
        console.error("Facebook popular error:", payload.message);
        setError(payload.message || payload.error);
        return;
      }

      const newItems = payload?.data ?? [];

      // Filter out duplicates based on post ID
      const uniqueNewItems = newItems.filter((item: FeedItem) => !loadedIds.has(item.id));
      if (isInitialLoad) {
        setItems(uniqueNewItems);
        setLoadedIds(new Set(uniqueNewItems.map((item: FeedItem) => item.id)));
      } else {
        setItems(prev => [...prev, ...uniqueNewItems]);
        setLoadedIds(prev => {
          const newIds = new Set(prev);
          uniqueNewItems.forEach((item: FeedItem) => newIds.add(item.id));
          return newIds;
        });
      }

      // Check if there are more posts to load
      setHasMore(newItems.length === 6 && uniqueNewItems.length > 0);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []);
  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      loadPosts(items.length);
    }
  };
  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">From Facebook</h2>
          <p className="text-muted-foreground">Unable to load posts right now.</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">Error: {error}</p>
        </header>
      </section>
    );
  }
  if (loading) {
    return <section className="container mx-auto py-12">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">All Facebook Posts</h2>
        <p className="text-muted-foreground">Latest updates from Achayans Media</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse">
          <div className="aspect-video bg-muted"></div>
          <CardContent className="p-4">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </CardContent>
        </Card>)}
      </div>
    </section>;
  }
  if (items.length === 0) return null;
  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    480: 1
  };
  return <section className="container mx-auto px-4 py-8 sm:py-12">
    <header className="mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">All News</h2>
      <p className="text-sm sm:text-base text-muted-foreground">Latest updates from Achayans Media</p>
    </header>

    <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto -ml-4" columnClassName="pl-4 bg-clip-padding">
      {items.map(item => {
        const img = item.attachments?.find(a => a.thumbnail_url || a.url);
        const title = item.message?.split("\n")[0]?.slice(0, 80) || "Facebook post";
        const excerpt = item.message?.slice(0, 150) || "";
        const slug = `facebook-${item.id}`;
        return <Card key={item.id} className="mb-4 overflow-hidden hover-scale transition-transform break-inside-avoid">
          <Link to={`/article/${slug}`}>
            {img && <div className="overflow-hidden bg-muted">
              <img src={img.thumbnail_url || img.url} alt={title} className="w-full h-auto object-contain" loading="lazy" />
            </div>}
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold text-base sm:text-lg leading-tight mb-2">
                {title}
              </h3>
              {excerpt && <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                {excerpt}
              </p>}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Facebook</span>
                <span>{new Date(item.created_time).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Link>
        </Card>;
      })}
    </Masonry>

    {hasMore && <div className="flex justify-center mt-8">
      <Button onClick={loadMorePosts} disabled={loadingMore} variant="outline" size="lg">
        {loadingMore ? "Loading..." : "Load More Posts"}
      </Button>
    </div>}
  </section>;
};
export default FacebookPopularPosts;