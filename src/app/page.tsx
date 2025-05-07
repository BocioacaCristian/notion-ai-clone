'use client';

import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isOpenAiKeyConfigured, getApiKeyStatusMessage } from '@/utils/apiKeyHelper';
import { useEditor } from '@/hooks/useEditor';

export default function Home() {
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const editor = useEditor({
    content: '',
    editable: true,
  });
  
  useEffect(() => {
    setApiKeyConfigured(isOpenAiKeyConfigured());
  }, []);
  
  return (
    <div className="flex h-screen bg-gradient-to-b from-background to-background/80">
      <Sidebar editor={editor} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-lg p-8 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-border/20">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary text-transparent bg-clip-text">Notion AI</h1>
          <p className="text-base mb-6 text-muted-foreground leading-relaxed">
            A professional document editor with AI-powered writing features.
            Create beautiful documents and enhance your productivity with advanced AI assistance.
          </p>
          
          {apiKeyConfigured === false && (
            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg mb-6 flex items-start gap-3 text-left border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-300">API Key Required</h3>
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  To enable AI features, add your OpenAI API key in <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-xs font-mono">.env.local</code> file 
                  as <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-xs font-mono">NEXT_PUBLIC_OPENAI_API_KEY=your_key</code>
                </p>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 mt-8">
            <Link href="/new" className="flex-1">
              <Button size="lg" className="w-full gap-2 shadow-sm transition-all hover:shadow-md">
                <PlusCircle className="h-4 w-4" />
                New Document
              </Button>
            </Link>
            
            <Link href="/ai/generate" className="flex-1">
              <Button size="lg" variant="outline" className="w-full gap-2 shadow-sm border-primary/20 hover:bg-primary/5 transition-all hover:shadow-md">
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
