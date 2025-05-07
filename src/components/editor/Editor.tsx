'use client';

import React, { useEffect } from 'react';
import { EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import { useEditor } from '@/hooks/useEditor';
import { EditorToolbar } from './EditorToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface EditorProps {
  documentId?: string;
  initialContent?: string;
  editable?: boolean;
  editor?: TiptapEditor | null;
}

export function Editor({ documentId, initialContent = '', editable = true, editor: externalEditor }: EditorProps) {
  const { currentDocument, fetchDocument, updateCurrentDocument } = useDocumentStore();
  
  // If documentId is provided, fetch the document
  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    }
  }, [documentId, fetchDocument]);
  
  // Only create a local editor if an external one wasn't provided
  const localEditor = useEditor({
    content: currentDocument?.content || initialContent,
    editable,
    onUpdate: ({ editor }) => {
      if (currentDocument) {
        updateCurrentDocument({ content: editor.getHTML() });
      }
    },
  });
  
  // Use either the external editor or the local one
  const editor = externalEditor || localEditor;
  
  // Update the editor content when the current document changes
  useEffect(() => {
    if (editor && currentDocument?.content) {
      // Only update if the content is different to avoid cursor jumps
      if (editor.getHTML() !== currentDocument.content) {
        editor.commands.setContent(currentDocument.content);
      }
    }
  }, [editor, currentDocument]);
  
  // Title input handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentDocument) {
      updateCurrentDocument({ title: e.target.value });
    }
  };
  
  return (
    <div className="flex-1 flex flex-col min-h-[70vh] max-w-4xl mx-auto w-full">
      {currentDocument && (
        <input
          type="text"
          value={currentDocument.title || ''}
          onChange={handleTitleChange}
          className="text-3xl font-bold py-6 px-8 w-full bg-transparent border-none outline-none focus:ring-0"
          placeholder="Untitled"
        />
      )}
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar editor={editor} />
        
        <div className="flex-1 border border-border/40 rounded-md shadow-sm bg-card dark:bg-card/40 min-h-[300px] text-base overflow-hidden">
          <EditorContent
            editor={editor}
            className="h-full min-h-[300px] prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none px-8 py-6"
          />
        </div>
      </div>
    </div>
  );
} 