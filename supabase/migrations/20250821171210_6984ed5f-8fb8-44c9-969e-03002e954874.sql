-- Create storage bucket for editorial images
INSERT INTO storage.buckets (id, name, public) VALUES ('editorial-images', 'editorial-images', true);

-- Create policies for editorial image uploads
CREATE POLICY "Admin users can upload editorial images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'editorial-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admin users can update editorial images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'editorial-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admin users can delete editorial images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'editorial-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Editorial images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'editorial-images');