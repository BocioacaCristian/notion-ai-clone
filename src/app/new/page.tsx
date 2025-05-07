'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/stores/documentStore';
import { toast } from 'sonner';

export default function NewDocumentPage() {
  const router = useRouter();
  const { createNewDocument } = useDocumentStore();
  
  useEffect(() => {
    const createDoc = async () => {
      try {
        const doc = createNewDocument();
        router.push(`/documents/${doc.id}`);
        
        toast.success('Document Created', {
          description: 'Your new document has been created successfully.'
        });
      } catch (error) {
        console.error('Failed to create new document:', error);
        
        toast.error('Error Creating Document', {
          description: 'There was an error creating your document. Please try again.'
        });
        
        router.push('/');
      }
    };
    
    createDoc();
  }, [createNewDocument, router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-xl mb-4">Creating new document...</h1>
        <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 border-gray-200 rounded-full mx-auto"></div>
      </div>
    </div>
  );
} 