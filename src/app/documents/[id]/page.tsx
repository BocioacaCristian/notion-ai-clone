'use client';

import { Editor } from '@/components/editor/Editor';
import { Sidebar } from '@/components/Sidebar';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { isOpenAiKeyConfigured } from '@/utils/apiKeyHelper';
import { use } from 'react';

interface PageParams {
  id: string;
}

export default function DocumentPage({ params }: { params: PageParams | Promise<PageParams> }) {
  // Unwrap params using React.use if it's a promise
  const resolvedParams: PageParams = params instanceof Promise ? use(params) : params;
  const documentId = resolvedParams.id;
  
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
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8">
          <Editor documentId={documentId} />
        </div>
      </div>
    </div>
  );
} 