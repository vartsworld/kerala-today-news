import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

async function ensureUniqueSlug(base: string, currentId: string): Promise<string> {
  let candidate = base || "untitled";
  let i = 2;
  
  for (let attempts = 0; attempts < 25; attempts++) {
    const { data, error } = await (supabase.from as any)("editorials")
      .select("id")
      .eq("slug", candidate)
      .neq("id", currentId) // Exclude current editorial
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
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
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
          setExcerpt(data.excerpt || "");
          setContent(data.content);
          setCover(data.cover_image_url || "");
          setStatus(data.status);
        }
      } catch (error: any) {
        console.error("Failed to load editorial:", error);
        toast({ 
          title: "Failed to load editorial", 
          description: error.message || "Editorial not found" 
        });
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
        excerpt,
        content,
        cover_image_url: cover || null,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("editorials")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      const desc = status === "published" ? "Updated and published" : "Draft updated";
      toast({ 
        title: "Editorial saved", 
        description: finalSlug !== slug ? `${desc}. Slug adjusted to ${finalSlug}` : desc 
      });
      
      navigate("/admin");
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        title: "Save failed", 
        description: error.message || "Failed to save editorial" 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto max-w-3xl py-10">
        <p>Loading editorial...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6 md:py-10">
      <SEO 
        title="Edit Editorial – Achayans Media" 
        description="Edit editorial content" 
        canonical="/admin/edit" 
        type="article" 
      />
      
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Edit editorial</h1>
        <p className="text-muted-foreground text-sm md:text-base">Make changes and update when ready.</p>
      </header>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Title</span>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter title" 
          />
        </label>
        
        <label className="grid gap-2">
          <span className="text-sm font-medium">Slug</span>
          <Input value={slug} readOnly aria-readonly className="bg-muted" />
        </label>
        
        <label className="grid gap-2">
          <span className="text-sm font-medium">Excerpt</span>
          <Textarea 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)} 
            placeholder="Short summary" 
            rows={3}
          />
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
          <Textarea 
            className="min-h-[200px] md:min-h-[240px]" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Write your editorial…" 
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex gap-2">
            <Button 
              variant={status === "draft" ? "secondary" : "outline"} 
              type="button" 
              onClick={() => setStatus("draft")}
              className="flex-1 sm:flex-none"
            >
              Draft
            </Button>
            <Button 
              variant={status === "published" ? "secondary" : "outline"} 
              type="button" 
              onClick={() => setStatus("published")}
              className="flex-1 sm:flex-none"
            >
              Publish
            </Button>
          </div>
          
          <div className="flex gap-2 sm:ml-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              disabled={saving}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !title || !content}
              className="flex-1 sm:flex-none"
            >
              {saving ? "Saving…" : status === "published" ? "Update & Publish" : "Update Draft"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditEditorial;