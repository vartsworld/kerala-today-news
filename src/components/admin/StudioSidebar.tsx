import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, FileText, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StudioSidebarProps {
    onSelect: (id: string) => void;
    selectedId?: string;
}

const StudioSidebar = ({ onSelect, selectedId }: StudioSidebarProps) => {
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

    const filtered = editorials.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.summary && e.summary.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-[#121212] border-r border-white/5">
            <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    Archive
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                        placeholder="Search editorials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20 h-11"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 pb-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/20">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm font-medium">Loading archives...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-white/20 italic">
                            No editorials found
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className={cn(
                                    "w-full text-left transition-all group",
                                    selectedId === item.id ? "scale-[1.02]" : "hover:scale-[1.01]"
                                )}
                            >
                                <Card className={cn(
                                    "border-none transition-all duration-300",
                                    selectedId === item.id
                                        ? "bg-primary/20 ring-1 ring-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                        : "bg-white/5 hover:bg-white/10"
                                )}>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest",
                                                item.is_published ? "text-green-500" : "text-amber-500"
                                            )}>
                                                {item.is_published ? "Published" : "Draft"}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(item.created_at), "MMM d, yyyy")}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed h-[34px]">
                                            {item.summary || "No summary provided..."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <button
                    onClick={() => onSelect('new')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all border border-white/5"
                >
                    <FileText className="h-4 w-4" />
                    Compose New
                </button>
            </div>
        </div>
    );
};

export default StudioSidebar;
