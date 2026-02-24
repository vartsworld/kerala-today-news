import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewsCard from "@/components/NewsCard";

interface RelatedArticle {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  href: string;
  source: string;
  isVideo?: boolean;
  facebookUrl?: string;
}

interface RelatedNewsSectionProps {
  articles: RelatedArticle[];
}

const RelatedNewsSection = ({ articles }: RelatedNewsSectionProps) => {
  if (!articles.length) return null;

  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Related News
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore more stories and insights from Kerala Today News
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard
            key={index}
            title={article.title}
            excerpt={article.excerpt}
            image={article.image}
            date={article.date}
            href={article.href}
            source={article.source}
            isVideo={article.isVideo}
            facebookUrl={article.facebookUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedNewsSection;