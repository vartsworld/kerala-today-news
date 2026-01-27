import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  href: string;
  source?: string;
}

const NewsCard = ({ title, excerpt, image, date, href, source }: NewsCardProps) => {
  return (
    <article className="h-full">
      <Card className="h-full flex flex-col overflow-hidden">
        {image && (
          <img src={image} alt={`${title} - Achayans Media`} loading="lazy" className="aspect-video w-full object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          {date && (
            <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
          <div className="mt-auto">
            <Button asChild variant="link">
              <a 
                href={href} 
                aria-label={`Read: ${title}`}
                {...(href.includes('facebook.com') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                Read more →
              </a>
            </Button>
            {source && <span className="ml-2 text-xs text-muted-foreground">Source: {source}</span>}
          </div>
        </CardContent>
      </Card>
    </article>
  );
};

export default NewsCard;
