import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight, Home, Play } from "lucide-react";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StickyContactCTA from "@/components/StickyContactCTA";
import ArticleProgressBar from "@/components/ArticleProgressBar";
import SocialShareButtons from "@/components/SocialShareButtons";
import { supabase } from "@/integrations/supabase/client";

interface Editorial {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    image_url: string | null;
    video_url: string | null;
    published_at: string | null;
    author_name: string | null;
    slug: string;
}

const EditorialDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [editorial, setEditorial] = useState<Editorial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEditorial = async () => {
            if (!slug) return;

            try {
                const { data, error } = await supabase
                    .from("editorials")
                    .select("*")
                    .eq("slug", slug)
                    .eq("is_published", true)
                    .maybeSingle();

                if (error) throw error;

                if (!data) {
                    setError("Editorial not found");
                } else {
                    setEditorial(data as Editorial);
                }
            } catch (err: any) {
                console.error("Error loading editorial:", err);
                setError("Failed to load editorial");
            } finally {
                setLoading(false);
            }
        };

        loadEditorial();
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

    if (error || !editorial) {
        return (
            <main className="min-h-screen bg-background py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Editorial Not Found</h1>
                <p className="text-muted-foreground mb-6">{error || "The editorial you are looking for does not exist."}</p>
                <Link to="/editorial" className="text-primary hover:underline">
                    View All Editorials
                </Link>
            </main>
        );
    }

    return (
        <>
            <ArticleProgressBar />
            <main className="min-h-screen bg-background">
                <SEO
                    title={`${editorial.title} — Editorial | Kerala Today News`}
                    description={editorial.summary || editorial.content.replace(/<[^>]*>/g, '').slice(0, 160)}
                    canonical={`/editorial/${editorial.slug}`}
                    type="article"
                    image={editorial.image_url || undefined}
                    publishedTime={editorial.published_at || undefined}
                    author={editorial.author_name || "Kerala Today Desk"}
                    keywords={["Kerala editorial", "opinion Kerala", editorial.title.split(' ').slice(0, 3).join(' ')]}
                    breadcrumbs={[
                        { name: "Home", href: "/" },
                        { name: "Editorial", href: "/editorial" },
                        { name: editorial.title },
                    ]}
                    structuredData={{
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        "headline": editorial.title,
                        "description": editorial.summary || editorial.content.replace(/<[^>]*>/g, '').slice(0, 160),
                        "image": editorial.image_url || "https://keralatoday.news/lovable-uploads/kerala-today-logo.png",
                        "datePublished": editorial.published_at,
                        "author": {
                            "@type": "Person",
                            "name": editorial.author_name || "Kerala Today Desk"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Kerala Today News",
                            "url": "https://keralatoday.news",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://keralatoday.news/lovable-uploads/kerala-today-logo.png",
                                "width": 512,
                                "height": 512
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://keralatoday.news/editorial/${editorial.slug}`
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
                            <Link to="/editorial" className="hover:text-foreground transition-colors">
                                Editorial
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-medium line-clamp-1">
                                {editorial.title}
                            </span>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <article className="space-y-8">
                            <header className="space-y-6">
                                <Badge variant="secondary">Editorial</Badge>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                    {editorial.title}
                                </h1>

                                {editorial.summary && (
                                    <p className="text-xl text-muted-foreground leading-relaxed italic">
                                        {editorial.summary}
                                    </p>
                                )}

                                <div className="flex items-center space-x-3 py-4 border-y">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold">KT</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{editorial.author_name || "Kerala Today Desk"}</p>
                                        <time className="text-sm text-muted-foreground">
                                            {new Date(editorial.published_at!).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                </div>
                            </header>

                            <div className="flex justify-center">
                                <SocialShareButtons
                                    title={editorial.title}
                                    url={`https://keralatoday.news/editorial/${editorial.slug}`}
                                />
                            </div>

                            {/* Media Section */}
                            <div className="space-y-6">
                                {editorial.video_url ? (
                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                                        <video
                                            src={editorial.video_url}
                                            controls
                                            className="w-full h-full"
                                            poster={editorial.image_url || undefined}
                                        />
                                    </div>
                                ) : editorial.image_url ? (
                                    <img
                                        src={editorial.image_url}
                                        alt={editorial.title}
                                        className="w-full h-auto rounded-xl shadow-lg object-cover max-h-[500px]"
                                    />
                                ) : null}
                            </div>

                            {/* Content */}
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none editorial-content"
                                dangerouslySetInnerHTML={{ __html: editorial.content }}
                            />

                            <Separator className="my-12" />
                        </article>

                        <div className="mt-12 text-center">
                            <Link to="/editorial">
                                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors">
                                    ← Back to Editorials
                                </Badge>
                            </Link>
                        </div>
                    </div>
                </div>

                <StickyContactCTA />
            </main>
        </>
    );
};

export default EditorialDetail;
