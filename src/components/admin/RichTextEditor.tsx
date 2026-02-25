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
                class: 'prose dark:prose-invert prose-red focus:outline-none max-w-none min-h-[500px] text-lg leading-relaxed text-foreground',
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
            <BubbleMenu editor={editor} className="flex flex-wrap items-center gap-1 bg-background/95 backdrop-blur-xl border border-border rounded-xl px-3 py-2 shadow-2xl">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-4 bg-border mx-1" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>

                <Separator orientation="vertical" className="h-4 bg-border mx-1" />

                <div className="flex items-center gap-2 px-2 border-r border-border min-h-[2rem]">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="w-6 h-6 border-none bg-transparent p-0 cursor-pointer"
                        title="Text Color"
                    />
                </div>

                <div className="flex items-center gap-2 px-2 border-r border-border min-h-[2rem]">
                    <Highlighter className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setHighlight({ color: (e.target as HTMLInputElement).value }).run()}
                        value={editor.getAttributes('highlight').color || '#ffff00'}
                        className="w-6 h-6 border-none bg-transparent p-0 cursor-pointer"
                        title="Highlight Color"
                    />
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-border min-h-[2rem]">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <select
                        onChange={(e) => {
                            const font = e.target.value;
                            if (font) {
                                // Add font stylesheet dynamically
                                const linkId = `font-${font.replace(/\s+/g, '-')}`;
                                if (!document.getElementById(linkId)) {
                                    const link = document.createElement('link');
                                    link.id = linkId;
                                    link.rel = 'stylesheet';
                                    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;500;700&display=swap`;
                                    document.head.appendChild(link);
                                }
                                editor.chain().focus().setFontFamily(font).run();
                            } else {
                                editor.chain().focus().unsetFontFamily().run();
                            }
                        }}
                        value={editor.getAttributes('textStyle').fontFamily || ''}
                        className="bg-transparent border-none text-sm outline-none cursor-pointer max-w-[120px] text-foreground"
                    >
                        <option className="bg-background text-foreground" value="">Default Font</option>
                        <option className="bg-background text-foreground" value="Inter">Inter</option>
                        <option className="bg-background text-foreground" value="Roboto">Roboto</option>
                        <option className="bg-background text-foreground" value="Open Sans">Open Sans</option>
                        <option className="bg-background text-foreground" value="Lato">Lato</option>
                        <option className="bg-background text-foreground" value="Montserrat">Montserrat</option>
                        <option className="bg-background text-foreground" value="Oswald">Oswald</option>
                        <option className="bg-background text-foreground" value="Playfair Display">Playfair Display</option>
                        <option className="bg-background text-foreground" value="Merriweather">Merriweather</option>
                        <option className="bg-background text-foreground" value="Outfit">Outfit</option>
                        <option className="bg-background text-foreground" value="Poppins">Poppins</option>
                    </select>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className="h-8 px-2"
                    title="Insert Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    className="h-8 px-2"
                    title="Insert Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    className="data-[state=on]:bg-secondary"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
            </BubbleMenu>

            {/* Editor Content */}
            <div className="min-h-[600px] cursor-text">
                <EditorContent editor={editor} />
            </div>

            {/* Inline Quick Actions Floating button */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-2xl border border-border rounded-2xl px-4 py-3 shadow-2xl opacity-80 hover:opacity-100 transition-opacity z-50">
                <Button variant="outline" size="sm" onClick={addImage} className="font-semibold shadow-sm">
                    <ImageIcon className="h-4 w-4 mr-2" /> Insert Image
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="hover:bg-accent hover:text-accent-foreground">
                    <Heading1 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="hover:bg-accent hover:text-accent-foreground">
                    <Heading2 className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className="hover:bg-accent hover:text-accent-foreground">
                    <List className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="hover:bg-accent hover:text-accent-foreground">
                    <ListOrdered className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default RichTextEditor;
