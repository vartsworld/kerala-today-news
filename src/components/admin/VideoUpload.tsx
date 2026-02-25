import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Video, Loader2, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VideoUploadProps {
    onVideoUploaded: (url: string) => void;
    currentVideo?: string;
}

const VideoUpload = ({ onVideoUploaded, currentVideo }: VideoUploadProps) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast({ title: "Invalid file type", description: "Please select a video file" });
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            toast({ title: "File too large", description: "Please select a video under 50MB" });
            return;
        }

        setUploading(true);
        setProgress(5);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Simulating progress since Supabase upload doesn't give clean progress easily without a customized helper
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 5 : prev));
            }, 500);

            const { error: uploadError } = await supabase.storage
                .from('editorial-videos')
                .upload(filePath, file);

            clearInterval(interval);
            if (uploadError) throw uploadError;

            setProgress(100);
            const { data } = supabase.storage
                .from('editorial-videos')
                .getPublicUrl(filePath);

            onVideoUploaded(data.publicUrl);

            toast({
                title: "Video uploaded",
                description: "Your video is ready"
            });

        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: "Upload failed",
                description: error.message === "Bucket not found"
                    ? "The 'editorial-videos' bucket is missing in Supabase! Please create it in your Supabase Storage dashboard."
                    : (error.message || "Failed to upload video"),
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            setProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {currentVideo ? (
                <div className="relative group w-full max-w-sm aspect-video rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-black">
                    <video
                        src={currentVideo}
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => onVideoUploaded('')}
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
                    <div className="absolute bottom-3 right-3 p-2 bg-primary/90 text-primary-foreground rounded-full">
                        <Play className="h-4 w-4 fill-current" />
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
                            <span className="text-xs font-medium uppercase tracking-wider text-center">
                                Uploading Video... {progress}%
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                                <Video className="h-6 w-6" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-sm">Click to upload video</p>
                                <p className="text-xs">MP4, WebM up to 50MB</p>
                            </div>
                        </>
                    )}
                </button>
            )}

            <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
    );
};

export default VideoUpload;
