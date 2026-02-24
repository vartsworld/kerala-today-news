import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import DashboardStatCard from "@/components/admin/DashboardStatCard";
import RecentEditorials from "@/components/admin/RecentEditorials";
import FacebookStatus from "@/components/admin/FacebookStatus";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Newspaper, Settings, LogOut, Facebook, Sparkles } from "lucide-react";
const AdminDashboard = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [total, setTotal] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [published, setPublished] = useState(0);
  useEffect(() => {
    supabase.auth.getUser().then(({
      data: {
        user
      }
    }) => setEmail(user?.email ?? null));
  }, []);
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const totalQ = supabase.from("editorials").select("*", {
          count: "exact",
          head: true
        });
        const draftsQ = supabase.from("editorials").select("*", {
          count: "exact",
          head: true
        }).eq("is_published", false);
        const publishedQ = supabase.from("editorials").select("*", {
          count: "exact",
          head: true
        }).eq("is_published", true);
        const [{
          count: t
        }, {
          count: d
        }, {
          count: p
        }] = await Promise.all([totalQ, draftsQ, publishedQ]);
        setTotal(t ?? 0);
        setDrafts(d ?? 0);
        setPublished(p ?? 0);
      } catch (e) {
        console.error("Failed loading counts", e);
      } finally {
        setLoadingCounts(false);
      }
    };
    loadCounts();
  }, []);
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return <main className="container mx-auto px-4 py-6 md:py-10 animate-fade-in">
    <SEO title="Admin Dashboard – Kerala Today News" description="Manage editorials and content" canonical="/admin" />

    <header className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground text-sm md:text-base">Signed in as {email ?? "…"}</p>
    </header>

    {/* Stats */}
    <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
      <DashboardStatCard title="All editorials" value={loadingCounts ? "…" : total} subtext="Total items" icon={<Newspaper className="h-4 w-4" />} />
      <DashboardStatCard title="Published" value={loadingCounts ? "…" : published} subtext="Visible on site" icon={<FileText className="h-4 w-4" />} />
      <DashboardStatCard title="Drafts" value={loadingCounts ? "…" : drafts} subtext="Work in progress" icon={<Settings className="h-4 w-4" />} />
    </section>

    {/* Quick actions */}
    <section className="mb-6 md:mb-8">
      <Card>
        <CardContent className="py-4">
          <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
            $1
            <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Link to="/admin/studio" className="hover-scale">
                <Sparkles className="mr-2 h-4 w-4" /> Launch Editorial Studio
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">

            </Button>
            <Button variant="secondary" onClick={logout} className="hover-scale w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>

    {/* Content */}
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <RecentEditorials />
      </div>
      <div className="lg:col-span-1">
        <FacebookStatus />
      </div>
    </section>
  </main>;
};
export default AdminDashboard;