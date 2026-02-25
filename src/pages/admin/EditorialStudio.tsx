import { useState, useEffect } from "react";
import StudioSidebar from "@/components/admin/StudioSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Save, Send, Eye, X, ChevronLeft,
    Settings, Image as ImageIcon, Video as VideoIcon,
    Layout, Sparkles, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ImageUpload from "@/components/admin/ImageUpload";
import VideoUpload from "@/components/admin/VideoUpload";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

const EditorialStudio = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const loadEditorial = async (id: string) => {
        if (id === 'new') {
            setTitle("");
            setSummary("");
            setContent("");
            setCover("");
            setVideoUrl("");
            setIsPublished(false);
            setSelectedId(null);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("editorials")
            .select("*")
            .eq("id", id)
            .single();

        if (!error && data) {
            setTitle(data.title);
            setSummary(data.summary || "");
            setContent(data.content);
            setCover(data.image_url || "");
            setVideoUrl(data.video_url || "");
            setIsPublished(data.is_published);
            setSelectedId(id);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ title: "Not authenticated" });
            setSaving(false);
            return;
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const payload = {
            title,
            summary,
            content,
            image_url: cover || null,
            video_url: videoUrl || null,
            is_published: isPublished,
            slug: selectedId ? undefined : slug, // Don't change slug on edit for now
            author_id: user.id,
            published_at: isPublished ? new Date().toISOString() : null,
        };

        let result;
        if (selectedId) {
            result = await supabase.from("editorials").update(payload).eq("id", selectedId);
        } else {
            (payload as any).slug = slug;
            result = await supabase.from("editorials").insert(payload).select().single();
        }

        if (result.error) {
            toast({ title: "Save failed", description: result.error.message, variant: "destructive" });
        } else {
            toast({ title: selectedId ? "Updated" : "Created" });
            if (!selectedId && result.data) {
                setSelectedId(result.data.id);
            }
        }
        setSaving(false);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-[350px] shrink-0 border-r border-border">
                <StudioSidebar onSelect={loadEditorial} selectedId={selectedId || undefined} />
            </div>

            {/* Main Studio Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-editor-mesh relative transition-all">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-4 min-w-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/admin")}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <h1 className="font-bold text-foreground truncate max-w-[200px] md:max-w-md">
                                {title || "Untitled Masterpiece"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="secondary" size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border">
                                    <Settings className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Settings</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-card border-l border-border text-card-foreground w-full sm:max-w-md overflow-y-auto">
                                <div className="py-6 space-y-8">
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Layout className="h-5 w-5 text-primary" />
                                            Metadata
                                        </h2>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold pt-4">Publication Cover</p>
                                        <ImageUpload currentImage={cover} onImageUploaded={setCover} />
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Excerpt</label>
                                            <Textarea
                                                value={summary}
                                                onChange={(e) => setSummary(e.target.value)}
                                                placeholder="What is this story about? (SEO)"
                                                className="bg-transparent border-input text-foreground resize-none h-32 focus:ring-primary/40"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Video</label>
                                            <VideoUpload currentVideo={videoUrl} onVideoUploaded={setVideoUrl} />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border space-y-4">
                                        <div className="flex items-center justify-between group">
                                            <div>
                                                <p className="font-bold text-sm">Target Slug</p>
                                                <p className="text-xs text-muted-foreground">/editorial/{selectedId ? "locked" : title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</p>
                                            </div>
                                            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                                            <div>
                                                <p className="font-bold text-sm text-primary">Public Visibility</p>
                                                <p className="text-[10px] text-muted-foreground leading-tight">Published editorials are visible to all readers.</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={isPublished ? "default" : "outline"}
                                                onClick={() => setIsPublished(!isPublished)}
                                                className={cn(
                                                    "rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-widest",
                                                    isPublished ? "bg-primary text-primary-foreground" : "border-border text-foreground"
                                                )}
                                            >
                                                {isPublished ? "Live" : "Draft"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Button
                            onClick={handleSave}
                            disabled={saving || !title}
                            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 px-6 font-bold"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                isPublished ? <><Send className="h-4 w-4 mr-2" /> Publish</> :
                                    <><Save className="h-4 w-4 mr-2" /> Save</>}
                        </Button>
                    </div>
                </header>

                {/* Editor Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
                    <div className="max-w-4xl mx-auto px-6 py-20">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground">
                                <Loader2 className="h-12 w-12 animate-spin" />
                                <p className="font-medium tracking-widest uppercase text-xs">Syncing Content...</p>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fade-in relative">
                                {/* Title Input Area */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/60">
                                        <div className="w-4 h-[1px] bg-primary/40" />
                                        Editorial Title
                                    </div>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter title..."
                                        className="text-4xl md:text-6xl font-black bg-transparent border-none text-foreground p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 leading-tight"
                                    />
                                    <div className="h-[1px] w-full bg-border" />
                                </div>

                                {/* Rich Editor */}
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                    placeholder="Tell your story..."
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .bg-editor-mesh {
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.05) 0%, transparent 50%);
        }
        .dark .bg-editor-mesh {
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.4);
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(128, 128, 128, 0.5);
          pointer-events: none;
          height: 0;
        }
      `}</style>
        </div>
    );
};

export default EditorialStudio;
