import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Facebook, Share2, MessageCircle, ExternalLink, ChevronRight, Home, Play } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NewsCard from "@/components/NewsCard";
import ArticleProgressBar from "@/components/ArticleProgressBar";
import SocialShareButtons from "@/components/SocialShareButtons";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import RelatedNewsSection from "@/components/RelatedNewsSection";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: { type: string; url?: string; thumbnail_url?: string }[];
}

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

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<FeedItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug || !slug.startsWith('facebook-')) {
        setError('Invalid article URL');
        setLoading(false);
        return;
      }

      try {
        const postId = slug.replace('facebook-', '');

        // Fetch all posts to find the specific one and get related posts
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/facebook-feed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ limit: 20 }),
        });

        if (!response.ok) {
          setError(`HTTP Error: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data?.error) {
          console.error('Error loading Facebook posts:', data.message);
          setError(data.message || data.error);
          return;
        }

        const posts = data?.data || [];
        const currentPost = posts.find((post: FeedItem) => post.id === postId);

        if (!currentPost) {
          setError('Article not found');
          return;
        }

        setArticle(currentPost);
        // Set other posts as related (excluding current one)
        setRelatedPosts(posts.filter((post: FeedItem) => post.id !== postId).slice(0, 6));

      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <>
        <ArticleProgressBar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <ArticleProgressBar />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The article you are looking for does not exist.'}</p>
            <Link to="/" className="text-primary hover:underline">
              Return to Homepage
            </Link>
          </div>
        </main>
      </>
    );
  }

  const articleTitle = article.message?.split('\n')[0]?.slice(0, 120) || 'Facebook Post';
  const articleContent = article.message || '';
  const featuredImage = article.attachments?.find(a => a.thumbnail_url || a.url);

  // Convert related posts to RelatedArticle format
  const relatedArticles: RelatedArticle[] = relatedPosts.map(post => ({
    title: post.message?.split('\n')[0]?.slice(0, 80) || 'Facebook Post',
    excerpt: post.message?.slice(0, 150) || '',
    image: post.attachments?.find(a => a.thumbnail_url || a.url)?.thumbnail_url ||
      post.attachments?.find(a => a.thumbnail_url || a.url)?.url ||
      '/lovable-uploads/kerala-today-logo.png',
    date: post.created_time,
    href: `/article/facebook-${post.id}`,
    source: 'Facebook',
    isVideo: post.attachments?.some(a => a.type?.includes('video')),
    facebookUrl: post.permalink_url
  }));

  return (
    <>
      <ArticleProgressBar />

      <main className="min-h-screen bg-background">
        <SEO
          title={`${articleTitle} — Kerala Today`}
          description={articleContent.slice(0, 160)}
          canonical={`/article/${slug}`}
          type="article"
          image={featuredImage?.thumbnail_url || featuredImage?.url}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: articleTitle,
            description: articleContent.slice(0, 160),
            datePublished: article.created_time,
            author: {
              "@type": "Organization",
              name: "Kerala Today",
              url: "https://www.keralatoday.news"
            },
            publisher: {
              "@type": "Organization",
              name: "Kerala Today",
              url: "https://www.keralatoday.news",
              logo: {
                "@type": "ImageObject",
                url: "https://www.keralatoday.news/lovable-uploads/kerala-today-logo.png",
                width: 400,
                height: 400
              }
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.keralatoday.news/article/${slug}`
            }
          }}
        />

        {/* Breadcrumbs */}
        <nav className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/" className="hover:text-foreground transition-colors">
                News
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium line-clamp-1">
                {articleTitle}
              </span>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <article className="flex-1 max-w-4xl">
              {/* Article Header */}
              <header className="space-y-6 mb-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    News
                  </Badge>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {articleTitle}
                  </h1>
                  {articleContent.length > 100 && (
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {articleContent.slice(0, 200)}...
                    </p>
                  )}
                </div>

                {/* Author & Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/lovable-uploads/kerala-today-logo.png"
                      alt="Kerala Today"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">Kerala Today</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <time dateTime={article.created_time}>
                          {new Date(article.created_time).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span>•</span>
                        <span>Facebook</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Social Share Buttons */}
              <div className="mb-8 flex justify-center">
                <SocialShareButtons
                  title={articleTitle}
                  url={`https://www.keralatoday.news/article/${slug}`}
                />
              </div>

              {/* Featured Image */}
              {featuredImage && (
                <div className="mb-8 relative group">
                  <img
                    src={featuredImage.thumbnail_url || featuredImage.url}
                    alt={articleTitle}
                    className="w-full h-64 md:h-[450px] object-contain bg-black rounded-lg shadow-lg"
                  />
                  {article.attachments?.some(a => a.type?.includes("video")) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href={article.permalink_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary/90 text-primary-foreground p-4 sm:p-6 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
                      >
                        <Play className="h-10 w-10 sm:h-14 sm:w-14 fill-current" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {articleContent.split('\n').map((paragraph, index) => {
                  const trimmedParagraph = paragraph.trim();

                  if (!trimmedParagraph) return null;

                  // Insert related news cards contextually after a few paragraphs
                  if (index === 2 && relatedArticles.length > 0) {
                    return (
                      <div key={index}>
                        <p className="text-lg leading-relaxed mb-8 text-muted-foreground">
                          {trimmedParagraph}
                        </p>
                        <Card className="my-8 bg-muted/30">
                          <CardHeader>
                            <CardTitle className="text-lg">Related News</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {relatedArticles.slice(0, 2).map((related, idx) => (
                                <Link
                                  key={idx}
                                  to={related.href}
                                  className="group block hover:bg-background/50 p-3 rounded-lg transition-colors"
                                >
                                  <div className="flex gap-3">
                                    <img
                                      src={related.image}
                                      alt={related.title}
                                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {related.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(related.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  }

                  return (
                    <p key={index} className="text-lg leading-relaxed mb-6 text-muted-foreground whitespace-pre-line">
                      {trimmedParagraph}
                    </p>
                  );
                })}
              </div>

              <Separator className="my-12" />

              {/* Newsletter Subscription */}
              <NewsletterSubscription />
            </article>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Trending Stories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.slice(0, 5).map((relatedArticle, index) => (
                    <Link
                      key={index}
                      to={relatedArticle.href}
                      className="group block hover:bg-muted/50 p-3 rounded-lg transition-colors -m-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm line-clamp-3 group-hover:text-primary transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(relatedArticle.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* Related News Section */}
          <RelatedNewsSection articles={relatedArticles} />
        </div>

        {/* Sticky Facebook Button */}
        <div className={`fixed transition-all duration-300 z-50 flex justify-center ${isSticky
          ? 'bottom-4 left-1/2 -translate-x-1/2 lg:top-1/2 lg:right-6 lg:left-auto lg:translate-x-0 lg:bottom-auto lg:-translate-y-1/2'
          : 'bottom-4 left-1/2 -translate-x-1/2 lg:opacity-0 lg:pointer-events-none'
          }`}>
          <Button
            asChild
            size="lg"
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-lg lg:rounded-full lg:h-14 lg:w-14 lg:p-0"
          >
            <a
              href={article.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open on Facebook"
            >
              <Facebook className="h-5 w-5" />
              <span className="ml-2 lg:hidden">Open on Facebook</span>
            </a>
          </Button>
        </div>
      </main>
    </>
  );
};

export default Article;
