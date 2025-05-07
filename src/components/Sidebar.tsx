'use client';

import React, { useEffect } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

export function Sidebar() {
  const { documents, fetchDocuments, createNewDocument, removeDocument } = useDocumentStore();
  const router = useRouter();
  
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
  
  return (
    <aside className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Notion AI Clone</h1>
      </div>
      
      <Button
        onClick={handleNewDocument}
        className="flex items-center gap-2 mb-4 w-full"
      >
        <PlusCircle className="h-4 w-4" />
        New Document
      </Button>
      
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
    </aside>
  );
} 