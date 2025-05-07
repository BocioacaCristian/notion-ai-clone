import { create } from 'zustand';
import { Document } from '@/types';
import { 
  getAllDocuments, 
  getDocument, 
  createDocument, 
  updateDocument, 
  deleteDocument 
} from '@/services/document';

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDocuments: () => void;
  fetchDocument: (id: string) => void;
  createNewDocument: (title?: string) => Document;
  updateCurrentDocument: (updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setCurrentDocument: (document: Document | null) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  
  // Fetch all documents
  fetchDocuments: () => {
    try {
      const documents = getAllDocuments();
      set({ documents, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch documents' });
    }
  },
  
  // Fetch a specific document
  fetchDocument: (id: string) => {
    set({ isLoading: true });
    try {
      const document = getDocument(id);
      if (document) {
        set({ currentDocument: document, error: null });
      } else {
        set({ error: 'Document not found' });
      }
    } catch (err) {
      set({ error: 'Failed to fetch document' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Create a new document
  createNewDocument: (title?: string) => {
    try {
      const newDocument = createDocument(title);
      set(state => ({ 
        documents: [...state.documents, newDocument],
        currentDocument: newDocument,
        error: null 
      }));
      return newDocument;
    } catch (err) {
      set({ error: 'Failed to create document' });
      throw err;
    }
  },
  
  // Update the current document
  updateCurrentDocument: (updates: Partial<Document>) => {
    const { currentDocument } = get();
    if (!currentDocument) {
      set({ error: 'No document selected' });
      return;
    }
    
    try {
      const updated = updateDocument(currentDocument.id, updates);
      if (updated) {
        set(state => ({
          currentDocument: updated,
          documents: state.documents.map(doc => 
            doc.id === updated.id ? updated : doc
          ),
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to update document' });
    }
  },
  
  // Delete a document
  removeDocument: (id: string) => {
    try {
      const success = deleteDocument(id);
      if (success) {
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== id),
          currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to delete document' });
    }
  },
  
  // Set the current document
  setCurrentDocument: (document: Document | null) => {
    set({ currentDocument: document });
  }
})); 