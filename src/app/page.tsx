'use client';

import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isOpenAiKeyConfigured, getApiKeyStatusMessage } from '@/utils/apiKeyHelper';

export default function Home() {
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  
  useEffect(() => {
    setApiKeyConfigured(isOpenAiKeyConfigured());
  }, []);
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Notion AI Clone</h1>
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            A simplified version of Notion with AI-powered writing features.
            Create documents, take notes, and use AI to enhance your writing.
          </p>
          
          {apiKeyConfigured === false && (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-6 flex items-start gap-3 text-left">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">OpenAI API Key Missing</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  AI features won't work without an API key. Create a <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">.env.local</code> file 
                  with <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">NEXT_PUBLIC_OPENAI_API_KEY=your_key</code>.
                </p>
              </div>
            </div>
          )}
          
          <Link href="/new">
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Your First Document
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
