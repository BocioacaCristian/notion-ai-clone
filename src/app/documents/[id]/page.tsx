'use client';

import { Editor } from '@/components/editor/Editor';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isOpenAiKeyConfigured } from '@/utils/apiKeyHelper';
import { use } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { useDocumentStore } from '@/stores/documentStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface PageParams {
  id: string;
}

export default function DocumentPage({ params }: { params: PageParams | Promise<PageParams> }) {
  // Unwrap params using React.use if it's a promise
  const resolvedParams: PageParams = params instanceof Promise ? use(params) : params;
  const documentId = resolvedParams.id;
  const { currentDocument, fetchDocument, updateCurrentDocument } = useDocumentStore();
  const router = useRouter();
  
  // Fetch document on mount
  useEffect(() => {
    if (documentId) {
      console.log('Fetching document:', documentId);
      fetchDocument(documentId);
    }
  }, [documentId, fetchDocument]);
  
  // Initialize the editor at page level so we can pass it to the Sidebar and Editor
  const editor = useEditor({
    content: currentDocument?.content || '<p></p>',
    editable: true,
    onUpdate: ({ editor }) => {
      console.log('Editor updated:', {
        html: editor.getHTML(),
        isEmpty: editor.isEmpty,
        hasContent: editor.getText().trim().length > 0
      });
      
      if (currentDocument) {
        // Only update if content actually changed
        if (editor.getHTML() !== currentDocument.content) {
          console.log('Updating document content');
          updateCurrentDocument({ content: editor.getHTML() });
        }
      }
    },
  });
  
  // Update editor when document changes
  useEffect(() => {
    if (editor && currentDocument?.content) {
      console.log('Document content changed, updating editor:', {
        documentContent: currentDocument.content,
        currentEditorContent: editor.getHTML()
      });
      
      // Only update if content is different to avoid cursor jumps
      if (editor.getHTML() !== currentDocument.content) {
        console.log('Setting editor content');
        editor.commands.setContent(currentDocument.content);
      }
    }
  }, [editor, currentDocument]);
  
  // Check for API key on component mount
  useEffect(() => {
    const apiKeyConfigured = isOpenAiKeyConfigured();
    
    if (!apiKeyConfigured) {
      toast.warning('OpenAI API Key Missing', {
        description: 'AI features will not work. Add your key to .env.local to enable them.',
        duration: 5000,
      });
    }
  }, []);
  
  // Handle navigation to AI generate page
  const handleNavigateToGenerate = () => {
    router.push('/ai/generate');
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar editor={editor} />
      
      <div className="flex-1 overflow-auto">
        <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleNavigateToGenerate}
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto py-8">
          <Editor documentId={documentId} />
        </div>
      </div>
    </div>
  );
} 