import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Quote, Image as ImageIcon,
    Heading1, Heading2, List, ListOrdered, Palette, Highlighter, Type
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl border shadow-lg max-w-full h-auto my-6 mx-auto block',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
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
                class: 'prose dark:prose-invert prose-red focus:outline-none max-w-none min-h-[500px] text-lg leading-relaxed text-foreground py-4',
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
                    toast({ title: "Image inserted at cursor" });
                } catch (error: any) {
                    toast({
                        title: "Upload failed",
                        description: error.message === "Bucket not found"
                            ? "The 'editorial-images' bucket is missing! Ask an Admin to run the Supabase migration."
                            : error.message,
                        variant: "destructive"
                    });
                }
            }
        };
        input.click();
    };

    const addImageUrl = () => {
        const url = window.prompt('Paste an Image URL:');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    if (!editor) return null;

    return (
        <div className="relative w-full border border-border rounded-2xl overflow-hidden bg-card/60 backdrop-blur-md shadow-sm">
            {/* Editorial Toolbar Header */}
            <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1.5 p-3 bg-muted/80 backdrop-blur-xl border-b border-border">
                {/* Text Formatting */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-5 bg-border mx-0.5" />

                {/* Headings */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 px-2", editor.isActive('heading', { level: 1 }) && "bg-primary/20 text-primary")}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 px-2", editor.isActive('heading', { level: 2 }) && "bg-primary/20 text-primary")}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-5 bg-border mx-0.5" />

                {/* Alignment */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-5 bg-border mx-0.5" />

                {/* Lists & Quotes */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 px-2", editor.isActive('bulletList') && "bg-primary/20 text-primary")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 px-2", editor.isActive('orderedList') && "bg-primary/20 text-primary")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-5 bg-border mx-0.5" />

                {/* Color & Highlight */}
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg border border-border bg-background/50">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="w-5 h-5 border-none bg-transparent p-0 cursor-pointer rounded"
                        title="Text Color"
                    />
                </div>

                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg border border-border bg-background/50">
                    <Highlighter className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setHighlight({ color: (e.target as HTMLInputElement).value }).run()}
                        value={editor.getAttributes('highlight').color || '#ffff00'}
                        className="w-5 h-5 border-none bg-transparent p-0 cursor-pointer rounded"
                        title="Highlight Color"
                    />
                </div>

                <Separator orientation="vertical" className="h-5 bg-border mx-0.5" />

                {/* Inline Image Uploaders Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 gap-1.5"
                            title="Insert Image"
                        >
                            <ImageIcon className="h-3.5 w-3.5" />
                            Insert Image
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={addImage} className="cursor-pointer gap-2 text-xs">
                            <ImageIcon className="h-4 w-4 text-primary" />
                            Upload from Computer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={addImageUrl} className="cursor-pointer gap-2 text-xs">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            Insert via Image URL
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Bubble Menu for quick inline text selection */}
            <BubbleMenu editor={editor} className="flex items-center gap-1 bg-background/95 backdrop-blur-xl border border-border rounded-xl px-2 py-1 shadow-2xl">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="h-7 w-7 p-0 data-[state=on]:bg-secondary"
                >
                    <Bold className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="h-7 w-7 p-0 data-[state=on]:bg-secondary"
                >
                    <Italic className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    className="h-7 w-7 p-0 data-[state=on]:bg-secondary"
                >
                    <UnderlineIcon className="h-3.5 w-3.5" />
                </Toggle>
            </BubbleMenu>

            {/* Editor Content Canvas */}
            <div className="p-6 min-h-[600px] cursor-text">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
