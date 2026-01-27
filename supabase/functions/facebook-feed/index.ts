// Facebook Feed Edge Function
// Fetches recent posts (with images/videos when available) from a Facebook Page
// Requires the following secrets configured in the project:
// - FACEBOOK_PAGE_ID
// - FACEBOOK_ACCESS_TOKEN (Page access token)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NormalizedAttachment {
  type: string;
  url?: string;
  thumbnail_url?: string;
}

interface NormalizedPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
  attachments?: NormalizedAttachment[];
}

function normalizeAttachments(att: any): NormalizedAttachment[] | undefined {
  if (!att) return undefined;
  const items: NormalizedAttachment[] = [];

  const pushItem = (node: any) => {
    const media = node.media || {};
    const image = media.image || {};
    const source = media.source || node.unshimmed_url;
    items.push({
      type: node.media_type || node.type || 'unknown',
      url: source || image.src,
      thumbnail_url: image.src,
    });
  };

  if (att.data && Array.isArray(att.data)) {
    att.data.forEach((node: any) => {
      if (node.subattachments && node.subattachments.data) {
        node.subattachments.data.forEach(pushItem);
      } else {
        pushItem(node);
      }
    });
  }

  return items.length ? items : undefined;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 9, offset = 0 } = await req.json().catch(() => ({ limit: 9, offset: 0 }));

    const PAGE_ID = Deno.env.get('FACEBOOK_PAGE_ID')?.trim();
    const ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN')?.trim();

    let pageId = PAGE_ID;
    let accessToken = ACCESS_TOKEN;

    // Fallback to database settings if env vars are missing
    if (!pageId || !accessToken) {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: settings, error: settingsError } = await supabase
          .from('facebook_settings')
          .select('page_id, access_token')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!settingsError && settings) {
          pageId = settings.page_id?.trim() || pageId;
          accessToken = settings.access_token?.trim() || accessToken;
        }
      }
    }

    if (!pageId || !accessToken) {
      return new Response(
        JSON.stringify({ data: [], error: 'not_configured', message: 'Facebook is not configured. Add PAGE_ID and ACCESS_TOKEN as Edge Function secrets or save them in facebook_settings.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fields = [
      'message',
      'created_time',
      'permalink_url',
      'full_picture',
      'attachments{media_type,media,subattachments}',
    ].join(',');

    const url = new URL(`https://graph.facebook.com/v19.0/${pageId}/posts`);
    url.searchParams.set('fields', fields);
    url.searchParams.set('access_token', accessToken);
    
    // For pagination, we need to fetch more posts and skip the offset amount
    // Facebook API doesn't support offset directly, so we fetch limit + offset
    const totalLimit = Math.min(limit + offset, 100); // Facebook has a max limit of 100
    url.searchParams.set('limit', String(totalLimit));

    const fbRes = await fetch(url.toString());
    const fbJson = await fbRes.json();

    if (!fbRes.ok) {
      console.error('Facebook API error:', fbJson);
      return new Response(
        JSON.stringify({
          data: [],
          error: 'facebook_api_error',
          message: 'Facebook API error when fetching posts. Verify Page ID and Page Access Token permissions (pages_read_engagement, pages_read_user_content).',
          details: fbJson,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data: NormalizedPost[] = (fbJson.data || []).map((p: any) => ({
      id: p.id,
      message: p.message,
      created_time: p.created_time,
      permalink_url: p.permalink_url,
      attachments: normalizeAttachments(p.attachments),
    }));

    // Apply offset and limit to the results
    const paginatedData = data.slice(offset, offset + limit);

    return new Response(JSON.stringify({ data: paginatedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Unhandled error:', e);
    return new Response(
      JSON.stringify({ data: [], error: 'unexpected_error', message: 'Unexpected error in facebook-feed', details: String(e) }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
