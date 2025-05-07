'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAiStore } from '@/stores/aiStore';
import { ContentGenerationAction } from '@/types';
import { toast } from 'sonner';

// Content generation options
const contentOptions = [
  { name: 'Generate Outline', value: 'generate-outline', description: 'Create a structured outline for your topic' },
  { name: 'Brainstorm Ideas', value: 'brainstorm-ideas', description: 'Get creative ideas related to your topic' },
  { name: 'Create List', value: 'create-list', description: 'Generate a comprehensive list about your topic' },
  { name: 'Create Table', value: 'create-table', description: 'Create a structured table for your data' },
  { name: 'Draft Email', value: 'draft-email', description: 'Write a professional email' },
  { name: 'Draft Social Post', value: 'draft-social-post', description: 'Create a social media post' },
];

export default function AiGeneratePage() {
  const router = useRouter();
  const { isProcessing, processContent } = useAiStore();
  const [prompt, setPrompt] = useState('');
  const [selectedOption, setSelectedOption] = useState<ContentGenerationAction>('brainstorm-ideas');
  const [generatedContent, setGeneratedContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle prompt submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    try {
      const response = await processContent(prompt.trim(), selectedOption);
      
      if (response.success && response.content) {
        setGeneratedContent(response.content);
        toast.success('Content generated successfully');
      } else {
        toast.error('Failed to generate content', {
          description: response.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  // Create a new document with the generated content
  const createDocument = () => {
    // Logic to create a new document with the generated content
    // will be implemented when needed
    router.push('/new');
  };
  
  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <div className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-xl font-bold">Notion AI Clone</Link>
        </div>
        
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Button>
        </Link>
        
        <h2 className="font-semibold mb-4">AI Generate</h2>
        
        <div className="space-y-2">
          {contentOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedOption === option.value ? 'default' : 'ghost'}
              className="w-full justify-start text-left"
              onClick={() => setSelectedOption(option.value as ContentGenerationAction)}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 className="text-xl font-bold">{contentOptions.find(o => o.value === selectedOption)?.name}</h1>
          <p className="text-sm text-gray-500">
            {contentOptions.find(o => o.value === selectedOption)?.description}
          </p>
        </header>
        
        <div className="flex-1 p-4 overflow-auto">
          <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
              ref={textareaRef}
              placeholder={`Enter a topic for "${contentOptions.find(o => o.value === selectedOption)?.name}"...`}
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
              className="w-full h-32 mb-2"
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isProcessing || !prompt.trim()} 
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
          
          {generatedContent && (
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4 mb-4">
              <h2 className="font-semibold mb-2">Generated Content</h2>
              <div className="prose prose-sm max-w-none">
                {generatedContent.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={createDocument}
                  variant="outline"
                  className="gap-2"
                >
                  Create New Document With This Content
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 