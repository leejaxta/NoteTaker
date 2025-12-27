import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
import { 
  AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineStrikethrough, 
  AiOutlineUnorderedList, AiOutlineOrderedList, 
  AiOutlineAlignLeft, AiOutlineAlignCenter, AiOutlineAlignRight
} from "react-icons/ai";
import "../../styles/RichTextEditor.css";

const RichTextEditor = ({ content, setContent }) => {
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    onSelectionUpdate: () => setUpdate(u => u + 1),
    editorProps: { attributes: { class: "rich-text-editor" } },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const isActive = (command, value) => {
    try {
      return value ? editor.isActive(command, value) : editor.isActive(command);
    } catch {
      return false;
    }
  };

  return (
    <div className="rich-text-editor-wrapper">
      <div className="rich-text-toolbar">
        <button
          type="button"
          className={isActive("bold") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
            setUpdate(u => u + 1);
          }}
          title="Bold"
        >
          <AiOutlineBold />
        </button>
        <button
          type="button"
          className={isActive("italic") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
            setUpdate(u => u + 1);
          }}
          title="Italic"
        >
          <AiOutlineItalic />
        </button>
        <button
          type="button"
          className={isActive("underline") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            setUpdate(u => u + 1);
          }}
          title="Underline"
        >
          <AiOutlineUnderline />
        </button>
        <button
          type="button"
          className={isActive("strike") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
            setUpdate(u => u + 1);
          }}
          title="Strikethrough"
        >
          <AiOutlineStrikethrough />
        </button>

        <div className="toolbar-separator" />

        <button
          type="button"
          className={isActive("bulletList") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
            setUpdate(u => u + 1);
          }}
          title="Bullet List"
        >
          <AiOutlineUnorderedList />
        </button>
        <button
          type="button"
          className={isActive("orderedList") ? "active" : ""}
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
            setUpdate(u => u + 1);
          }}
          title="Numbered List"
        >
          <AiOutlineOrderedList />
        </button>
        
        <div className="toolbar-separator" />

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          title="Align Left"
        >
          <AiOutlineAlignLeft />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          title="Align Center"
        >
          <AiOutlineAlignCenter />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          title="Align Right"
        >
          <AiOutlineAlignRight />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
