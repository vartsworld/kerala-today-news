import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Editorial {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  published_at: string;
}

const LatestEditorial = () => {
  const [editorial, setEditorial] = useState<Editorial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestEditorial = async () => {
      try {
        const { data, error } = await supabase
          .from('editorials')
          .select('id, title, excerpt, slug, published_at')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Failed to load latest editorial:', error);
        } else {
          setEditorial(data);
        }
      } catch (err) {
        console.error('Error loading latest editorial:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLatestEditorial();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!editorial) {
    return (
      <div className="text-sm text-muted-foreground">
        No published editorials available yet.
      </div>
    );
  }

  return (
    <a href={`/editorial/${editorial.slug}`} className="block rounded-lg border bg-card p-3 hover-scale">
      <p className="text-sm font-medium leading-snug">{editorial.title}</p>
      <span className="text-xs text-muted-foreground">
        Editorial • {new Date(editorial.published_at).toLocaleDateString()}
      </span>
    </a>
  );
};

export default LatestEditorial;