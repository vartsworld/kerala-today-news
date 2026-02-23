import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";

const FacebookStatus = () => {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [pageName, setPageName] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);

  interface FeedItem {
    id: string;
    message?: string;
    created_time: string;
    permalink_url: string;
    attachments?: { type: string; url?: string; thumbnail_url?: string }[];
  }
  const [latest, setLatest] = useState<FeedItem | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("facebook_settings")
        .select("page_name,page_id,updated_at")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn("Facebook status load error", error.message);
      }
      if (data) {
        setConnected(true);
        setPageName(data.page_name ?? null);
        setPageId(data.page_id ?? null);
      } else {
        setConnected(false);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!connected) return;
    let mounted = true;
    (async () => {
      setFeedLoading(true);
      setFeedError(null);
      const { data, error } = await supabase.functions.invoke('facebook-feed', { body: { limit: 1 } });
      if (!mounted) return;
      if (error) {
        setFeedError(error.message);
        setLatest(null);
      } else {
        const payload = data as any;
        if (payload?.error) {
          setFeedError(payload.message || 'Facebook feed error');
        }
        const arr = payload?.data ?? [];
        setLatest(arr[0] ?? null);
      }
      setFeedLoading(false);
    })();
    return () => { mounted = false; };
  }, [connected]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Facebook Page</CardTitle>
        <Badge variant={connected ? "default" : "secondary"}>
          {connected ? "Connected" : "Not connected"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking connection…</p>
        ) : connected ? (
          <div>
            <p className="text-sm">{pageName || "Page"}</p>
            <p className="text-xs text-muted-foreground">ID: {pageId}</p>
            <div className="mt-3 border-t pt-3">
              <p className="text-xs font-medium mb-2">Latest post</p>
              {feedLoading ? (
                <p className="text-sm text-muted-foreground">Fetching latest post…</p>
              ) : feedError ? (
                <p className="text-sm text-muted-foreground">Couldn’t fetch: {feedError}</p>
              ) : latest ? (
                <a href={latest.permalink_url} target="_blank" rel="noopener noreferrer" className="flex gap-3 group">
                  {(latest.attachments && latest.attachments.find(a => a.thumbnail_url || a.url)) ? (
                    <img
                      src={(latest.attachments.find(a => a.thumbnail_url || a.url))?.thumbnail_url || (latest.attachments.find(a => a.thumbnail_url || a.url))?.url}
                      alt="Latest Facebook post preview"
                      className="h-12 w-12 rounded object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm line-clamp-2 group-hover:underline">{(latest.message ?? "Facebook post").split("\n")[0]}</p>
                    <p className="text-xs text-muted-foreground">{new Date(latest.created_time).toLocaleString()}</p>
                  </div>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No posts found.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Connect your Facebook Page to show the latest posts on the site.
          </p>
        )}
        <Button asChild variant="outline" size="sm" className="hover-scale">
          <Link to="/admin/facebook">
            <Facebook className="mr-2 h-4 w-4" /> {connected ? "Edit connection" : "Connect now"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FacebookStatus;
