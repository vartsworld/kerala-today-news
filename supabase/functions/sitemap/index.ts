import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
  "Access-Control-Allow-Origin": "*",
};

const BASE_URL = "https://keralatoday.news";

const staticPages = [
  { loc: "/", title: "Kerala Today News — Breaking News, Editorials & Live Updates", priority: "1.0", changefreq: "hourly" },
  { loc: "/editorial", title: "Editorials & Opinion — Kerala Today News", priority: "0.9", changefreq: "daily" },
  { loc: "/about", title: "About Us — Kerala Today News", priority: "0.6", changefreq: "monthly" },
  { loc: "/contact", title: "Contact Us — Kerala Today News", priority: "0.5", changefreq: "monthly" },
  { loc: "/terms", title: "Terms & Conditions — Kerala Today News", priority: "0.3", changefreq: "yearly" },
  { loc: "/privacy", title: "Privacy Policy — Kerala Today News", priority: "0.3", changefreq: "yearly" },
];

Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: editorials } = await supabase
      .from("editorials")
      .select("slug, title, updated_at, published_at, image_url")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Editorial pages
    if (editorials) {
      for (const ed of editorials) {
        xml += `  <url>
    <loc>${BASE_URL}/editorial/${ed.slug}</loc>
    <lastmod>${ed.updated_at || ed.published_at || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>Kerala Today News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${ed.published_at || now}</news:publication_date>
      <news:title>${escapeXml(ed.title)}</news:title>
    </news:news>${ed.image_url ? `
    <image:image>
      <image:loc>${escapeXml(ed.image_url)}</image:loc>
      <image:title>${escapeXml(ed.title)}</image:title>
    </image:image>` : ""}
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, { headers: corsHeaders });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
