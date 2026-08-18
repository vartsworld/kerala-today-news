import { useState, useEffect } from "react";
import StudioSidebar from "@/components/admin/StudioSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Save, Send, Eye, X, ChevronLeft, PanelLeftClose, PanelLeftOpen,
    Settings, Image as ImageIcon, Video as VideoIcon,
    Layout, Sparkles, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState("Kerala Today Desk");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [cover, setCover] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [customSlug, setCustomSlug] = useState("");
    const [isSlugEdited, setIsSlugEdited] = useState(false);

    const loadEditorial = async (id: string) => {
        if (id === 'new') {
            setTitle("");
            setAuthorName("Kerala Today Desk");
            setSummary("");
            setContent("");
            setCover("");
            setVideoUrl("");
            setIsPublished(false);
            setCustomSlug("");
            setIsSlugEdited(false);
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
            setAuthorName(data.author_name || "Kerala Today Desk");
            setSummary(data.summary || "");
            setContent(data.content || "");
            setCover(data.image_url || "");
            setVideoUrl(data.video_url || "");
            setIsPublished(data.is_published);
            setCustomSlug(data.slug || "");
            setIsSlugEdited(true);
            setSelectedId(id);
        }
        setLoading(false);
    };

    // Auto Slug Generator: Supports Malayalam Unicode characters, converts spaces to hyphens, strips invalid punctuation
    const generateAutoSlug = (text: string, id: string | null) => {
        const cleaned = text
            .trim()
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep all Unicode letters (Malayalam + English), numbers, spaces & hyphens
            .replace(/[\s_]+/g, '-')           // Replace spaces/underscores with hyphens
            .replace(/-+/g, '-')              // Replace multiple hyphens with single
            .replace(/(^-|-$)/g, '');          // Trim leading/trailing hyphens

        if (cleaned) return cleaned;
        if (id) return `editorial-${id.slice(0, 8)}`;
        return "editorial-post";
    };

    const autoSlug = generateAutoSlug(title, selectedId);
    const activeSlug = isSlugEdited ? (customSlug.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/(^-|-$)/g, '') || autoSlug) : autoSlug;

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ title: "Not authenticated" });
            setSaving(false);
            return;
        }

        const payload = {
            title,
            author_name: authorName || "Kerala Today Desk",
            summary,
            content,
            image_url: cover || null,
            video_url: videoUrl || null,
            is_published: isPublished,
            slug: activeSlug,
            author_id: user.id,
            published_at: isPublished ? new Date().toISOString() : null,
        };

        let result;
        if (selectedId) {
            result = await supabase.from("editorials").update(payload).eq("id", selectedId);
        } else {
            result = await supabase.from("editorials").insert(payload).select().single();
        }

        if (result.error) {
            toast({ title: "Save failed", description: result.error.message, variant: "destructive" });
        } else {
            toast({ title: selectedId ? "Updated successfully" : "Created & Saved" });
            if (!selectedId && result.data) {
                setSelectedId(result.data.id);
            }
        }
        setSaving(false);
    };

    return (
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            <div className={cn(
                "hidden lg:block shrink-0 border-r border-border transition-all duration-300 overflow-hidden",
                sidebarCollapsed ? "w-0 border-none" : "w-[350px]"
            )}>
                <StudioSidebar onSelect={loadEditorial} selectedId={selectedId || undefined} />
            </div>

            {/* Main Studio Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-editor-mesh relative transition-all h-full overflow-hidden">
                {/* Top Navbar - Non-sticky */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/admin")}
                            className="lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex text-muted-foreground hover:text-foreground"
                            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
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
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hidden sm:flex text-muted-foreground hover:text-foreground"
                            disabled={!title}
                            onClick={() => {
                                window.open(`/editorial/${activeSlug}`, '_blank');
                            }}
                        >
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="secondary" size="sm" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border">
                                    <Send className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Publish</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-card border-l border-border text-card-foreground w-full sm:max-w-md overflow-y-auto">
                                <SheetHeader className="text-left space-y-1 pb-4 border-b border-border">
                                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                        <Layout className="h-5 w-5 text-primary" />
                                        Publication Details & Settings
                                    </SheetTitle>
                                    <SheetDescription className="text-xs text-muted-foreground">
                                        Configure editorial media, excerpt, custom URL slug, and public visibility.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="py-6 space-y-8">
                                    <div className="space-y-2">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Publication Cover</p>
                                        <ImageUpload currentImage={cover} onImageUploaded={setCover} />
                                        <Input
                                            value={cover}
                                            onChange={(e) => setCover(e.target.value)}
                                            placeholder="Or paste an Image URL..."
                                            className="bg-transparent border-input text-foreground text-xs font-mono"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author Name</label>
                                            <Input
                                                value={authorName}
                                                onChange={(e) => setAuthorName(e.target.value)}
                                                placeholder="e.g. Kerala Today Desk or Editor Name"
                                                className="bg-transparent border-input text-foreground text-sm"
                                            />
                                        </div>

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
                                            <Input
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                placeholder="Or paste a Video URL..."
                                                className="bg-transparent border-input text-foreground text-xs font-mono mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                                    Target Slug URL
                                                </label>
                                                {isSlugEdited && (
                                                    <button
                                                        onClick={() => {
                                                            setIsSlugEdited(false);
                                                            setCustomSlug("");
                                                        }}
                                                        className="text-[10px] text-primary hover:underline"
                                                    >
                                                        Reset to Auto
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 bg-accent/40 rounded-md border border-input px-3 py-1 text-xs">
                                                <span className="text-muted-foreground font-mono select-none">/editorial/</span>
                                                <Input
                                                    value={isSlugEdited ? customSlug : autoSlug}
                                                    onChange={(e) => {
                                                        setIsSlugEdited(true);
                                                        setCustomSlug(e.target.value);
                                                    }}
                                                    placeholder="custom-slug"
                                                    className="bg-transparent border-none p-0 h-7 text-xs font-mono focus-visible:ring-0 text-foreground"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                                            <div>
                                                <p className="font-bold text-sm text-primary">Public Visibility</p>
                                                <p className="text-[10px] text-muted-foreground leading-tight">Published editorials are visible to all readers.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-xs font-semibold", !isPublished ? "text-primary" : "text-muted-foreground")}>Draft</span>
                                                <div
                                                    onClick={() => setIsPublished(!isPublished)}
                                                    className={cn(
                                                        "w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors border",
                                                        isPublished ? "bg-primary border-primary" : "bg-muted border-input"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "bg-background w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform",
                                                            isPublished ? "translate-x-4" : "translate-x-0"
                                                        )}
                                                    />
                                                </div>
                                                <span className={cn("text-xs font-semibold", isPublished ? "text-primary" : "text-muted-foreground")}>Live</span>
                                            </div>
                                        </div>

                                        {isPublished && (
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving || !title}
                                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold mt-2"
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                                {saving ? "Publishing..." : "Publish Editorial Now"}
                                            </Button>
                                        )}
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
                                    <Textarea
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = `${e.target.scrollHeight}px`;
                                        }}
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = 'auto';
                                                el.style.height = `${el.scrollHeight}px`;
                                            }
                                        }}
                                        placeholder="Enter title..."
                                        rows={1}
                                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-transparent border-none text-foreground p-0 min-h-[50px] resize-none focus-visible:ring-0 placeholder:text-muted-foreground/30 leading-snug break-words overflow-hidden"
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
