-- Add missing columns to facebook_settings
ALTER TABLE public.facebook_settings ADD COLUMN IF NOT EXISTS page_name text;
ALTER TABLE public.facebook_settings ADD COLUMN IF NOT EXISTS created_by uuid;