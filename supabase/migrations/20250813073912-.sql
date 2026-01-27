-- Create table to store Facebook Page connection settings (manual connect)
CREATE TABLE public.facebook_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL,
  access_token text NOT NULL,
  page_name text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.facebook_settings ENABLE ROW LEVEL SECURITY;

-- Policies: only admins can manage/read settings
CREATE POLICY "Admins can view facebook settings"
  ON public.facebook_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert facebook settings"
  ON public.facebook_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update facebook settings"
  ON public.facebook_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete facebook settings"
  ON public.facebook_settings
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Keep updated_at fresh
CREATE TRIGGER set_facebook_settings_updated_at
BEFORE UPDATE ON public.facebook_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();