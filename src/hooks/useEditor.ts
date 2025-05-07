import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import { useCallback } from 'react';
import { useDocumentStore } from '@/stores/documentStore';

interface UseEditorProps {
  content?: string;
  editable?: boolean;
  onUpdate?: (html: string) => void;
}

export const useEditor = ({ content = '', editable = true, onUpdate }: UseEditorProps = {}) => {
  const { currentDocument, updateCurrentDocument } = useDocumentStore();
  
  // Handle content updates
  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    const html = editor.getHTML();
    
    // Update the document in the store
    if (currentDocument) {
      updateCurrentDocument({ content: html });
    }
    
    // Call the custom onUpdate handler if provided
    if (onUpdate) {
      onUpdate(html);
    }
  }, [currentDocument, updateCurrentDocument, onUpdate]);
  
  // Initialize the editor
  const editor = useTiptapEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      CodeBlock,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    editable,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none p-4',
      },
    },
  });
  
  return editor;
}; 