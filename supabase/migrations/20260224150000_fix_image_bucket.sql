-- Ensure storage bucket for editorial images exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('editorial-images', 'editorial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for editorial-images
-- Drop existing policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
    DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
    DROP POLICY IF EXISTS "Editorial images are publicly viewable" ON storage.objects;
    DROP POLICY IF EXISTS "Admin users can upload editorial images" ON storage.objects;
    DROP POLICY IF EXISTS "Admin users can update editorial images" ON storage.objects;
    DROP POLICY IF EXISTS "Admin users can delete editorial images" ON storage.objects;
END $$;

-- Re-create simplified policies
CREATE POLICY "Public Access Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'editorial-images' );

CREATE POLICY "Admin Upload Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'editorial-images' AND
  (public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admin Update Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'editorial-images' AND
  (public.has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Admin Delete Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'editorial-images' AND
  (public.has_role(auth.uid(), 'admin'))
);
