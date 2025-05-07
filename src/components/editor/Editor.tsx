'use client';

import React, { useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditor } from '@/hooks/useEditor';
import { EditorToolbar } from './EditorToolbar';
import { AiToolbar } from './AiToolbar';
import { useDocumentStore } from '@/stores/documentStore';

interface EditorProps {
  documentId?: string;
  initialContent?: string;
  editable?: boolean;
}

export function Editor({ documentId, initialContent = '', editable = true }: EditorProps) {
  const { currentDocument, fetchDocument, updateCurrentDocument } = useDocumentStore();
  
  // If documentId is provided, fetch the document
  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    }
  }, [documentId, fetchDocument]);
  
  // Initialize the editor with the document content
  const editor = useEditor({
    content: currentDocument?.content || initialContent,
    editable,
    onUpdate: (html) => {
      if (currentDocument) {
        updateCurrentDocument({ content: html });
      }
    },
  });
  
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
    <div className="flex flex-col h-full w-full min-h-[60vh]">
      {currentDocument && (
        <input
          type="text"
          value={currentDocument.title || ''}
          onChange={handleTitleChange}
          className="text-3xl font-bold p-4 w-full bg-transparent border-none outline-none"
          placeholder="Untitled"
        />
      )}
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar editor={editor} />
        <div className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 min-h-[200px] text-sm">
          <EditorContent
            editor={editor}
            className="h-full min-h-[200px] prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none p-4"
          />
        </div>
        <AiToolbar editor={editor} />
      </div>
    </div>
  );
} 