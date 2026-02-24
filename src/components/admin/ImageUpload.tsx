import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUploaded, currentImage }: ImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file type", description: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 5MB" });
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      setProgress(30);
      const { error: uploadError } = await supabase.storage
        .from('editorial-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setProgress(80);
      const { data } = supabase.storage
        .from('editorial-images')
        .getPublicUrl(filePath);

      setProgress(100);
      onImageUploaded(data.publicUrl);

      toast({
        title: "Image uploaded",
        description: "Your image is ready"
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image"
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative group w-full max-w-sm aspect-video rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onImageUploaded('')}
              className="h-9"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 w-full px-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <Progress value={progress} className="h-1 w-full" />
              <span className="text-xs font-medium uppercase tracking-wider">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">Click to upload cover</p>
                <p className="text-xs">JPG, PNG, WebP up to 5MB</p>
              </div>
            </>
          )}
        </button>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;