import { create } from 'zustand';
import { AiAction, AiResponse } from '@/types';
import { processWithAI } from '@/services/openai';
import { useModelStore } from '@/stores/modelStore';

interface AiState {
  isProcessing: boolean;
  result: string | null;
  error: string | null;
  selectedAction: AiAction | null;
  
  // Actions
  processContent: (content: string, action: AiAction, options?: { language?: string }) => Promise<AiResponse>;
  setSelectedAction: (action: AiAction | null) => void;
  resetState: () => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  isProcessing: false,
  result: null,
  error: null,
  selectedAction: null,
  
  // Process content with AI
  processContent: async (content: string, action: AiAction, options?: { language?: string }) => {
    set({ isProcessing: true, error: null, result: null });
    
    try {
      // Get the currently selected model from the model store
      const selectedModel = useModelStore.getState().selectedModel;
      
      const response = await processWithAI(content, action, selectedModel, options);
      
      if (response.success) {
        set({ result: response.content, error: null });
      } else {
        set({ error: response.error || 'Processing failed', result: null });
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      set({ error: errorMessage, result: null });
      
      return {
        content: '',
        success: false,
        error: errorMessage
      };
    } finally {
      set({ isProcessing: false });
    }
  },
  
  // Set selected AI action
  setSelectedAction: (action: AiAction | null) => {
    set({ selectedAction: action });
  },
  
  // Reset the state
  resetState: () => {
    set({
      isProcessing: false,
      result: null,
      error: null,
      selectedAction: null
    });
  }
})); 