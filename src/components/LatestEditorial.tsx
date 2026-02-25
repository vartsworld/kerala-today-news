import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Editorial {
  id: string;
  title: string;
  summary: string | null;
  slug: string;
  published_at: string | null;
  image_url: string | null;
}

const LatestEditorial = () => {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLatestEditorial = async () => {
      try {
        const { data, error } = await supabase
          .from('editorials')
          .select('id, title, summary, slug, published_at, image_url')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Failed to load latest editorial:', error);
        } else {
          setEditorials(data || []);
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
      <div className="space-y-4">
        {/* Loader for highlighted editorial */}
        <div className="rounded-lg border bg-muted/20 p-3 animate-pulse">
          <div className="h-40 bg-muted rounded mb-3 w-full"></div>
          <div className="h-4 bg-muted rounded mb-2 w-full"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
        {/* Loaders for list editorials */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-20 h-20 bg-muted rounded-md shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-4/5"></div>
              <div className="h-2 bg-muted rounded w-1/2 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (editorials.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/10 text-center">
        No published editorials available yet.
      </div>
    );
  }

  const highlighted = editorials[0];
  const others = editorials.slice(1);

  return (
    <div className="space-y-4">
      {/* Highlighted Top Editorial */}
      <a href={`/editorial/${highlighted.slug}`} className="block rounded-lg border bg-card p-3 hover:shadow-md transition-all group hover-scale">
        <div className="overflow-hidden rounded-md mb-3 aspect-video relative bg-muted">
          {highlighted.image_url ? (
            <img
              src={highlighted.image_url}
              alt={highlighted.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <p className="text-base font-bold leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{highlighted.title}</p>
        <p className="text-xs text-muted-foreground">
          {highlighted.published_at ? new Date(highlighted.published_at).toLocaleDateString() : 'Draft'}
        </p>
      </a>

      {/* List Editorials */}
      {others.length > 0 && (
        <div className="flex flex-col gap-3">
          {others.map((ed) => (
            <a key={ed.id} href={`/editorial/${ed.slug}`} className="flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors border border-transparent hover:border-border">
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-md bg-muted">
                {ed.image_url ? (
                  <img
                    src={ed.image_url}
                    alt={ed.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
                <p className="text-sm font-semibold leading-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                  {ed.title}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {ed.published_at ? new Date(ed.published_at).toLocaleDateString() : 'Draft'}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestEditorial;