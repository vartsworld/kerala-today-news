import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, FileText, Calendar, MoreVertical, Archive, Trash2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudioSidebarProps {
    onSelect: (id: string) => void;
    selectedId?: string;
}

const StudioSidebar = ({ onSelect, selectedId }: StudioSidebarProps) => {
    const { toast } = useToast();
    const [editorials, setEditorials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchEditorials = async () => {
        const { data, error } = await supabase
            .from("editorials")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setEditorials(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEditorials();
    }, []);

    const togglePublishStatus = async (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        const newStatus = !item.is_published;
        const { error } = await supabase
            .from("editorials")
            .update({ 
                is_published: newStatus,
                published_at: newStatus ? new Date().toISOString() : null 
            })
            .eq("id", item.id);

        if (error) {
            toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
        } else {
            toast({ title: newStatus ? "Editorial Published" : "Editorial Archived to Draft" });
            fetchEditorials();
        }
    };

    const handleDelete = async (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${item.title || 'Untitled'}"?`)) return;

        const { error } = await supabase
            .from("editorials")
            .delete()
            .eq("id", item.id);

        if (error) {
            toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Editorial deleted" });
            if (selectedId === item.id) {
                onSelect('new');
            }
            fetchEditorials();
        }
    };

    const filtered = editorials.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.summary && e.summary.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    Archive
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search editorials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-accent/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50 text-foreground placeholder:text-muted-foreground h-11"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm font-medium">Loading archives...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground italic">
                            No editorials found
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className={cn(
                                    "w-full text-left transition-all cursor-pointer group relative block",
                                    selectedId === item.id ? "scale-[1.02]" : "hover:scale-[1.01]"
                                )}
                            >
                                <Card className={cn(
                                    "border-none transition-all duration-300",
                                    selectedId === item.id
                                        ? "bg-primary/20 ring-1 ring-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                        : "bg-accent/50 hover:bg-accent"
                                )}>
                                    <CardContent className="p-3.5 space-y-2">
                                        {/* Status & Options Row */}
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                                item.is_published 
                                                    ? "text-emerald-400 bg-emerald-950/60 border-emerald-800/50" 
                                                    : "text-amber-400 bg-amber-950/60 border-amber-800/50"
                                            )}>
                                                {item.is_published ? "Published" : "Draft"}
                                            </span>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors focus:outline-none"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={(e) => togglePublishStatus(e, item)}
                                                        className="cursor-pointer gap-2 text-xs"
                                                    >
                                                        {item.is_published ? (
                                                            <>
                                                                <Archive className="h-4 w-4 text-amber-500" />
                                                                Move to Draft
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Globe className="h-4 w-4 text-green-500" />
                                                                Publish Article
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => handleDelete(e, item)}
                                                        className="cursor-pointer gap-2 text-xs text-red-500 focus:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete Article
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            {item.title || "Untitled Article"}
                                        </h3>

                                        {/* Date Footer Badge */}
                                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground font-mono">
                                            <div className="flex items-center gap-1.5 text-foreground/80 bg-background/80 px-2 py-0.5 rounded border border-border/80 font-bold">
                                                <Calendar className="h-3 w-3 text-primary" />
                                                <span>{format(new Date(item.created_at), "MMM d, yyyy")}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30">
                <button
                    onClick={() => onSelect('new')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-accent/50 hover:bg-accent rounded-xl text-foreground font-bold transition-all border border-border"
                >
                    <FileText className="h-4 w-4" />
                    Compose New
                </button>
            </div>
        </div>
    );
};

export default StudioSidebar;
