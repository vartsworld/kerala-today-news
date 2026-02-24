-- Add video_url to editorials table
ALTER TABLE public.editorials ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Create storage bucket for editorial videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('editorial-videos', 'editorial-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for editorial-videos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'editorial-videos' );

CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'editorial-videos' AND
  (public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'editorial-videos' AND
  (public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'editorial-videos' AND
  (public.has_role(auth.uid(), 'admin'))
);
