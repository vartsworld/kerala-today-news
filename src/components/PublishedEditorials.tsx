import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import NewsCard from "@/components/NewsCard";

interface Editorial {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  cover_image_url: string;
  published_at: string;
  author_id: string;
}

interface PublishedEditorialsProps {
  limit?: number;
  showTitle?: boolean;
  gridCols?: string;
}

const PublishedEditorials = ({ 
  limit = 10, 
  showTitle = true, 
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
}: PublishedEditorialsProps) => {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEditorials = async () => {
      try {
        const { data, error } = await supabase
          .from('editorials')
          .select('id, title, excerpt, slug, cover_image_url, published_at, author_id')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Failed to load editorials:', error);
          setError(error.message);
        } else {
          setEditorials(data || []);
        }
      } catch (err) {
        console.error('Error loading editorials:', err);
        setError('Failed to load editorials');
      } finally {
        setLoading(false);
      }
    };

    loadEditorials();
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Editorial</h2>
            <p className="text-muted-foreground">Opinion and analysis from our desk.</p>
          </header>
        )}
        <div className={`grid gap-6 ${gridCols}`}>
          {[...Array(Math.min(limit, 3))].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || editorials.length === 0) {
    return (
      <div>
        {showTitle && (
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Editorial</h2>
            <p className="text-muted-foreground">Opinion and analysis from our desk.</p>
          </header>
        )}
        <div className="text-center py-8 text-muted-foreground">
          {error ? 'Failed to load editorials' : 'No published editorials available yet.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      {showTitle && (
        <header className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Editorial</h2>
          <p className="text-muted-foreground">Opinion and analysis from our desk.</p>
        </header>
      )}
      <div className={`grid gap-6 ${gridCols}`}>
        {editorials.map((editorial) => (
          <NewsCard
            key={editorial.id}
            title={editorial.title}
            excerpt={editorial.excerpt || 'Read this editorial piece...'}
            href={`/editorial/${editorial.slug}`}
            image={editorial.cover_image_url}
            date={editorial.published_at}
            source="Editorial"
          />
        ))}
      </div>
    </div>
  );
};

export default PublishedEditorials;