import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism-tomorrow.css";

interface EditorialEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

const EditorialEditor = ({ value, onChange, placeholder }: EditorialEditorProps) => {
    return (
        <div className="relative w-full min-h-[400px] rounded-xl border bg-[#2d2d2d] overflow-hidden shadow-inner group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <span className="ml-2 text-xs font-medium text-white/40 uppercase tracking-widest">
                        Content Editor
                    </span>
                </div>
                <div className="text-[10px] text-white/20 font-mono">
                    HTML / Markdown Supported
                </div>
            </div>

            <div className="p-4 font-mono text-sm leading-relaxed overflow-auto max-h-[600px]">
                <Editor
                    value={value}
                    onValueChange={onChange}
                    highlight={(code) => highlight(code, languages.markup, "markup")}
                    padding={10}
                    placeholder={placeholder}
                    className="editor-textarea min-h-[350px] text-[#e0e0e0] outline-none"
                    style={{
                        fontFamily: '"Fira Code", "Fira Mono", monospace',
                        fontSize: 14,
                    }}
                />
            </div>

            <style>{`
        .editor-textarea textarea {
          outline: none !important;
        }
        .editor-textarea pre {
          white-space: pre-wrap !important;
          word-break: break-all !important;
        }
      `}</style>
        </div>
    );
};

export default EditorialEditor;
