import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Quote, Image as ImageIcon,
    Heading1, Heading2, List, ListOrdered
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
    const { toast } = useToast();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl border shadow-lg max-w-full h-auto my-6 mx-auto block',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your story...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-red focus:outline-none max-w-none min-h-[500px] text-lg leading-relaxed',
            },
        },
    });

    const addImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('editorial-images')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage
                        .from('editorial-images')
                        .getPublicUrl(fileName);

                    editor?.chain().focus().setImage({ src: data.publicUrl }).run();
                    toast({ title: "Image inserted" });
                } catch (error: any) {
                    toast({ title: "Upload failed", description: error.message, variant: "destructive" });
                }
            }
        };
        input.click();
    };

    if (!editor) return null;

    return (
        <div className="relative w-full">
            {/* Floating Bubble Menu */}
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 shadow-2xl">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="text-white hover:bg-white/10 h-8 px-2"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    className="text-white hover:bg-white/10 data-[state=on]:bg-white/20"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
            </BubbleMenu>

            {/* Editor Content */}
            <div className="min-h-[600px] cursor-text">
                <EditorContent editor={editor} />
            </div>

            {/* Inline Quick Actions Floating button? Or just use a permanent toolbar at bottom/top */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-2xl px-4 py-3 shadow-3xl opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={addImage} className="text-white/60 hover:text-white">
                    <ImageIcon className="h-5 w-5 mr-2" /> Add Image
                </Button>
                <Separator orientation="vertical" className="h-6 bg-white/5" />
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="text-white/60 hover:text-white">
                    <Heading1 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className="text-white/60 hover:text-white">
                    <List className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default RichTextEditor;
