import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import VideoUpload from "@/components/admin/VideoUpload";
import EditorialEditor from "@/components/admin/EditorialEditor";
import { Save, Eye, Send, FileText, Layout, Settings, ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(base: string, currentId: string): Promise<string> {
  let candidate = base || "untitled";
  let i = 2;
  for (let attempts = 0; attempts < 25; attempts++) {
    const { data } = await supabase.from("editorials")
      .select("id")
      .eq("slug", candidate)
      .neq("id", currentId)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${base}-${i++}`;
  }
  return `${base}-${Date.now()}`;
}

const EditEditorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const slug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (!id) {
      navigate("/admin");
      return;
    }

    const loadEditorial = async () => {
      try {
        const { data, error } = await supabase
          .from("editorials")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title);
          setSummary(data.summary || "");
          setContent(data.content);
          setCover(data.image_url || "");
          setVideoUrl(data.video_url || "");
          setIsPublished(data.is_published);
        }
      } catch (error: any) {
        console.error("Failed to load editorial:", error);
        toast({ title: "Failed to load", description: error.message });
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadEditorial();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Not signed in" });
        return;
      }

      const finalSlug = await ensureUniqueSlug(slug, id!);

      const payload: any = {
        slug: finalSlug,
        title,
        summary,
        content,
        image_url: cover || null,
        video_url: videoUrl || null,
        is_published: isPublished,
        published_at: isPublished ? (new Date().toISOString()) : null,
      };

      const { error } = await supabase
        .from("editorials")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Updated", description: "Changes saved successfully" });
      navigate("/admin");
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Loading editorial content...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <SEO title="Edit Editorial – Kerala Today News" description="Edit your editorial content" canonical="/admin/edit" />

      {/* Sticky Header Actions */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 hidden sm:block">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-bold truncate">
                {title || "Untitled Editorial"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => window.open(`/editorial/${slug}`, '_blank')}>
              <Eye className="h-4 w-4 mr-2" /> View Live
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !title || !content}
              size="sm"
              className="px-6 shadow-lg shadow-primary/20"
            >
              {saving ? (
                "Saving..."
              ) : isPublished ? (
                <><Send className="h-4 w-4 mr-2" /> Update & Publish</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Update Draft</>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Editor Section */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Editorial Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a catchy title..."
                    className="text-2xl md:text-3xl font-bold h-auto py-3 px-0 border-none focus-visible:ring-0 placeholder:text-muted-foreground/30"
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">Slug:</span>
                    <span className="px-2 py-0.5 bg-muted rounded truncate max-w-sm">/editorial/{slug}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content Writing Area</label>
                  <EditorialEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Update your editorial story here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section */}
          <aside className="space-y-6">
            <Tabs defaultValue="metadata" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-12">
                <TabsTrigger value="metadata" className="gap-2">
                  <Settings className="h-4 w-4" /> Media
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Layout className="h-4 w-4" /> Options
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="mt-4 space-y-6">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Media</label>
                      <ImageUpload currentImage={cover} onImageUploaded={setCover} />
                      <Input
                        value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        placeholder="Image URL..."
                        className="text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Video</label>
                      <VideoUpload currentVideo={videoUrl} onVideoUploaded={setVideoUrl} />
                      <Input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Video URL..."
                        className="text-xs font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4 space-y-6">
                <Card>
                  <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Excerpt / Summary</label>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief summary for social sharing..."
                        className="resize-none min-h-[120px] text-sm"
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Publication Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={!isPublished ? "default" : "outline"}
                          onClick={() => setIsPublished(false)}
                          className="w-full"
                          size="sm"
                        >
                          Draft
                        </Button>
                        <Button
                          variant={isPublished ? "default" : "outline"}
                          onClick={() => setIsPublished(true)}
                          className="w-full"
                          size="sm"
                        >
                          Visible
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default EditEditorial;