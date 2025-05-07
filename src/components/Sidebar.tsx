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
  Lightbulb,
  CheckSquare
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
    <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg mb-4">
      <Button
        variant={activeCategory === 'writing-tools' ? 'default' : 'ghost'}
        size="sm"
        className={`flex-1 text-xs font-medium ${activeCategory === 'writing-tools' ? 'shadow-sm' : ''}`}
        onClick={() => isAiGeneratePage 
          ? setActiveCategory('writing-tools') 
          : handleNavigateToGenerate('writing-tools')}
      >
        <PenTool className="mr-1.5 h-3.5 w-3.5" />
        Writing
      </Button>
      <Button
        variant={activeCategory === 'content-generation' ? 'default' : 'ghost'}
        size="sm"
        className={`flex-1 text-xs font-medium ${activeCategory === 'content-generation' ? 'shadow-sm' : ''}`}
        onClick={() => isAiGeneratePage 
          ? setActiveCategory('content-generation') 
          : handleNavigateToGenerate('content-generation')}
      >
        <Lightbulb className="mr-1.5 h-3.5 w-3.5" />
        Generate
      </Button>
    </div>
  );
  
  return (
    <aside className="w-64 h-screen border-r border-border/50 bg-card/30 backdrop-blur-sm p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary text-transparent bg-clip-text">Notion AI</h1>
      </div>
      
      {currentView === 'documents' ? (
        // Documents View
        <>
          <div className="flex gap-2 mb-5">
            <Button
              onClick={handleNewDocument}
              className="flex items-center justify-center gap-1.5 flex-1 shadow-sm hover:shadow"
              size="sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              New
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSwitchToAiTools}
              className="flex items-center justify-center gap-1 shadow-sm hover:shadow border-border/60 hover:bg-muted/50"
              size="sm"
              title="AI Tools"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI
            </Button>

            <Link href="/todos">
              <Button 
                variant="outline"
                className="flex items-center justify-center gap-1 shadow-sm hover:shadow border-border/60 hover:bg-muted/50"
                size="sm"
                title="Todo Lists"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Todos
              </Button>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center mb-3">
              <h2 className="text-xs font-medium text-muted-foreground tracking-wide">DOCUMENTS</h2>
            </div>
            
            {documents.length === 0 ? (
              <div className="px-3 py-6 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center text-center">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-xs text-muted-foreground">No documents yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewDocument}
                  className="mt-2 text-xs h-7 px-2"
                >
                  Create your first
                </Button>
              </div>
            ) : (
              <ul className="space-y-0.5">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <Link href={`/documents/${doc.id}`}>
                      <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/50 text-sm group">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />
                          <div className="truncate flex-1">
                            <div className="font-medium truncate text-xs">
                              {doc.title || 'Untitled'}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
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
                              <Trash2 className="h-3.5 w-3.5" />
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
              className="gap-1 -ml-2 pr-3 h-7"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <h2 className="font-medium text-sm flex-1 text-center">AI Assistant</h2>
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