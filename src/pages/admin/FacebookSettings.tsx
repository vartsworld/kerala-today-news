import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FacebookSettings = () => {
  const { toast } = useToast();
  const [id, setId] = useState<string | null>(null);
  const [pageId, setPageId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [pageName, setPageName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("facebook_settings")
        .select("id,page_id,access_token,page_name")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Failed to load settings", error);
        toast({ title: "Could not load settings", description: error.message, variant: "destructive" });
        return;
      }
      if (data) {
        setId(data.id);
        setPageId(data.page_id ?? "");
        setAccessToken(data.access_token ?? "");
        setPageName(data.page_name ?? "");
      }
    };
    load();
  }, [toast]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const userId = userData.user?.id;

      if (!pageId || !accessToken) {
        toast({ title: "Page ID and Access Token are required", variant: "destructive" });
        return;
      }

      if (id) {
        const { error } = await supabase.from("facebook_settings")
          .update({ page_id: pageId, access_token: accessToken, page_name: pageName || null, updated_by: userId })
          .eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("facebook_settings")
          .insert({ page_id: pageId, access_token: accessToken, page_name: pageName || null, updated_by: userId } as any)
          .select("id")
          .single();
        if (error) throw error;
        setId(data.id);
      }

      toast({ title: "Saved", description: "Facebook Page connection saved successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Save failed", description: err.message ?? "Unexpected error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10">
      <SEO title="Facebook Settings – Kerala Today News" description="Connect Facebook Page manually" canonical="/admin/facebook" />
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Connect Facebook Page (Manual)</h1>
        <p className="text-muted-foreground">Paste your Facebook Page ID and a long-lived Page Access Token.</p>
      </header>

      <section className="max-w-xl">
        <form onSubmit={onSave} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="page_id">Facebook Page ID</Label>
            <Input id="page_id" value={pageId} onChange={(e) => setPageId(e.target.value)} placeholder="e.g. 1234567890" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page_name">Page Name (optional)</Label>
            <Input id="page_name" value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder="e.g. Kerala Today News" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access_token">Long-lived Page Access Token</Label>
            <Input id="access_token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} placeholder="EAAG..." />
            <p className="text-sm text-muted-foreground">We store this securely. Only admins can read or modify it.</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save settings"}</Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default FacebookSettings;
