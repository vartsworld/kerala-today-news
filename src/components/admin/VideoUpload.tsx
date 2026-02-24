import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Video } from "lucide-react";

interface VideoUploadProps {
    onVideoUploaded: (url: string) => void;
    currentVideo?: string;
}

const VideoUpload = ({ onVideoUploaded, currentVideo }: VideoUploadProps) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            toast({ title: "Invalid file type", description: "Please select a video file" });
            return;
        }

        // Validate file size (50MB limit for videos)
        if (file.size > 50 * 1024 * 1024) {
            toast({ title: "File too large", description: "Please select a video under 50MB" });
            return;
        }

        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // We'll try to upload to 'editorial-videos', assuming it exists or can be created
            const { error: uploadError } = await supabase.storage
                .from('editorial-videos')
                .upload(filePath, file);

            if (uploadError) {
                // If the bucket doesn't exist, we might get an error. 
                // In a real scenario, we'd ensure the bucket exists.
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('editorial-videos')
                .getPublicUrl(filePath);

            onVideoUploaded(data.publicUrl);

            toast({
                title: "Video uploaded successfully",
                description: "Your video has been uploaded and is ready to use"
            });

        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload video. Ensure 'editorial-videos' bucket exists."
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const clearVideo = () => {
        onVideoUploaded('');
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    <Video className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Video"}
                </Button>
                {currentVideo && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearVideo}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Remove
                    </Button>
                )}
            </div>

            <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {currentVideo && (
                <div className="mt-3">
                    <video
                        src={currentVideo}
                        controls
                        className="w-full max-w-xs rounded-lg border object-cover"
                        style={{ maxHeight: '200px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
