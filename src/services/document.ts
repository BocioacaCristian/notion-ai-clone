import { Document } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'notion-ai-clone-documents';

/**
 * Save documents to localStorage
 */
function saveDocuments(documents: Document[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
}

/**
 * Get all documents from localStorage
 */
export function getAllDocuments(): Document[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error parsing documents:', error);
    return [];
  }
}

/**
 * Get a document by its ID
 */
export function getDocument(id: string): Document | null {
  const documents = getAllDocuments();
  return documents.find(doc => doc.id === id) || null;
}

/**
 * Create a new document
 */
export function createDocument(title: string = 'Untitled'): Document {
  const newDocument: Document = {
    id: uuidv4(),
    title,
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const documents = getAllDocuments();
  documents.push(newDocument);
  saveDocuments(documents);
  
  return newDocument;
}

/**
 * Update an existing document
 */
export function updateDocument(id: string, updates: Partial<Document>): Document | null {
  const documents = getAllDocuments();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the document
  documents[index] = {
    ...documents[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  saveDocuments(documents);
  return documents[index];
}

/**
 * Delete a document
 */
export function deleteDocument(id: string): boolean {
  const documents = getAllDocuments();
  const newDocuments = documents.filter(doc => doc.id !== id);
  
  if (newDocuments.length === documents.length) {
    return false; // Document not found
  }
  
  saveDocuments(newDocuments);
  return true;
} 