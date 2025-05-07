'use client';

import React, { useEffect, useState } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  FileText, 
  Trash2, 
  Sparkles,
  ArrowLeft,
  PenTool,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { WritingToolsTab } from './ai/writing-tools/WritingToolsTab';
import { ContentGenerationTab } from './ai/content-generation/ContentGenerationTab';
import { useAiStore } from '@/stores/aiStore';
import { AiFeatureCategory } from '@/types';
import { Editor } from '@tiptap/react';

type SidebarView = 'documents' | 'ai-tools';

interface SidebarProps {
  editor: Editor | null;
}

export function Sidebar({ editor }: SidebarProps) {
  const { documents, fetchDocuments, createNewDocument, removeDocument } = useDocumentStore();
  const { activeCategory, setActiveCategory } = useAiStore();
  const [currentView, setCurrentView] = useState<SidebarView>('documents');
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the AI generate page
  const isAiGeneratePage = pathname?.startsWith('/ai/generate');
  
  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Create new document
  const handleNewDocument = () => {
    try {
      const newDoc = createNewDocument();
      router.push(`/documents/${newDoc.id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };
  
  // Delete document
  const handleDeleteDocument = (id: string) => {
    removeDocument(id);
  };
  
  // Switch to AI tools view
  const handleSwitchToAiTools = () => {
    // If in a document, open AI sidebar
    if (pathname?.startsWith('/documents/')) {
      setCurrentView('ai-tools');
    } else {
      // Otherwise, navigate to the AI generate page
      router.push('/ai/generate');
    }
  };
  
  // Navigate to generate page with specific option
  const handleNavigateToGenerate = (category: AiFeatureCategory) => {
    setActiveCategory(category);
    router.push('/ai/generate');
  };
  
  // Return to documents view
  const handleBackToDocuments = () => {
    setCurrentView('documents');
  };
  
  // Render AI category selection buttons
  const renderAiCategoryButtons = () => (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4">
      <Button
        variant={activeCategory === 'writing-tools' ? 'default' : 'ghost'}
        size="sm"
        className="flex-1 text-sm"
        onClick={() => isAiGeneratePage 
          ? setActiveCategory('writing-tools') 
          : handleNavigateToGenerate('writing-tools')}
      >
        <PenTool className="mr-2 h-4 w-4" />
        Writing
      </Button>
      <Button
        variant={activeCategory === 'content-generation' ? 'default' : 'ghost'}
        size="sm"
        className="flex-1 text-sm"
        onClick={() => isAiGeneratePage 
          ? setActiveCategory('content-generation') 
          : handleNavigateToGenerate('content-generation')}
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        Generate
      </Button>
    </div>
  );
  
  return (
    <aside className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Notion AI Clone</h1>
      </div>
      
      {currentView === 'documents' ? (
        // Documents View
        <>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={handleNewDocument}
              className="flex items-center gap-2 flex-1"
            >
              <PlusCircle className="h-4 w-4" />
              New Document
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSwitchToAiTools}
              className="flex items-center gap-1"
              title="AI Tools"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">DOCUMENTS</h2>
            
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500">No documents yet. Create one to get started!</p>
            ) : (
              <ul className="space-y-1">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <Link href={`/documents/${doc.id}`}>
                      <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <div className="truncate flex-1">
                            <div className="font-medium truncate">
                              {doc.title || 'Untitled'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.updatedAt && formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        <ConfirmationDialog
                          title="Delete Document"
                          description="Are you sure you want to delete this document? This action cannot be undone."
                          confirmText="Delete"
                          confirmVariant="destructive"
                          onConfirm={() => handleDeleteDocument(doc.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        // AI Tools View
        <>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDocuments}
              className="gap-1 -ml-2 pr-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h2 className="font-semibold flex-1 text-center">AI Assistant</h2>
          </div>
          
          {renderAiCategoryButtons()}
          
          <div className="flex-1 overflow-y-auto">
            {activeCategory === 'writing-tools' && <WritingToolsTab editor={editor} />}
            {activeCategory === 'content-generation' && <ContentGenerationTab editor={editor} />}
          </div>
        </>
      )}
    </aside>
  );
} 