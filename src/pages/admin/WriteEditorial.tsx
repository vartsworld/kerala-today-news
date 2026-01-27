import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(base: string): Promise<string> {
  // Try base, then base-2, base-3, ... until available
  let candidate = base || "untitled";
  let i = 2;
  // Safety cap
  for (let attempts = 0; attempts < 25; attempts++) {
    const { data, error } = await (supabase.from as any)("editorials")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data) return candidate;
    candidate = `${base}-${i++}`;
  }
  // Fallback with timestamp to avoid infinite loops
  return `${base}-${Date.now()}`;
}

const WriteEditorial = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const slug = useMemo(() => slugify(title), [title]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not signed in" });
      setSaving(false);
      return;
    }

    const finalSlug = await ensureUniqueSlug(slug);

    const payload: any = {
      slug: finalSlug,
      title,
      summary,
      content,
      image_url: cover || null,
      is_published: isPublished,
      author_id: user.id,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("editorials").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message });
    } else {
      const desc = isPublished ? "Published" : "Draft created";
      toast({ title: "Editorial saved", description: finalSlug !== slug ? `${desc}. Slug adjusted to ${finalSlug}` : desc });
    }
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6 md:py-10">
      <SEO title="Write Editorial – Kerala Today News" description="Create and publish editorials" canonical="/admin/write" type="article" />
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Write editorial</h1>
        <p className="text-muted-foreground text-sm md:text-base">Compose your piece and publish when ready.</p>
      </header>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Title</span>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Slug</span>
          <Input value={slug} readOnly aria-readonly className="bg-muted" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Summary</span>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" rows={3} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Cover image</span>
          <ImageUpload 
            currentImage={cover} 
            onImageUploaded={setCover}
          />
          <Input 
            value={cover} 
            onChange={(e) => setCover(e.target.value)} 
            placeholder="Or enter image URL directly..." 
            className="text-sm"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Content (HTML or Markdown)</span>
          <Textarea className="min-h-[200px] md:min-h-[240px]" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your editorial…" />
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex gap-2">
            <Button 
              variant={!isPublished ? "secondary" : "outline"} 
              type="button" 
              onClick={() => setIsPublished(false)}
              className="flex-1 sm:flex-none"
            >
              Draft
            </Button>
            <Button 
              variant={isPublished ? "secondary" : "outline"} 
              type="button" 
              onClick={() => setIsPublished(true)}
              className="flex-1 sm:flex-none"
            >
              Publish
            </Button>
          </div>
          <div className="sm:ml-auto">
            <Button 
              onClick={handleSave} 
              disabled={saving || !title || !content}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving…" : isPublished ? "Save & Publish" : "Save draft"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WriteEditorial;
