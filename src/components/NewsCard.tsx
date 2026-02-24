import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface NewsCardProps {
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  href: string;
  source?: string;
  isVideo?: boolean;
}

const NewsCard = ({ title, excerpt, image, date, href, source, isVideo }: NewsCardProps) => {
  return (
    <article className="h-full">
      <Card className="h-full flex flex-col overflow-hidden group">
        {image && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={`${title} - Kerala Today News`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transform transition-transform group-hover:scale-125">
                  <Play className="h-6 w-6 fill-current" />
                </div>
              </div>
            )}
          </div>
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
