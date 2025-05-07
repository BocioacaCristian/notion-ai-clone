import { create } from 'zustand';
import { 
  AiAction, 
  AiResponse, 
  ToneType, 
  EmailType, 
  SocialPlatform,
  AiFeatureCategory
} from '@/types';
import { processWithAI } from '@/services/openai';
import { useModelStore } from '@/stores/modelStore';

interface AiState {
  isProcessing: boolean;
  result: string | null;
  error: string | null;
  selectedAction: AiAction | null;
  activeCategory: AiFeatureCategory;
  
  // Actions
  processContent: (
    content: string, 
    action: AiAction, 
    options?: { 
      language?: string; 
      tone?: ToneType;
      emailType?: EmailType;
      platform?: SocialPlatform;
    }
  ) => Promise<AiResponse>;
  setSelectedAction: (action: AiAction | null) => void;
  setActiveCategory: (category: AiFeatureCategory) => void;
  resetState: () => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  isProcessing: false,
  result: null,
  error: null,
  selectedAction: null,
  activeCategory: 'writing-tools', // Default category
  
  // Process content with AI
  processContent: async (
    content: string, 
    action: AiAction, 
    options?: { 
      language?: string;
      tone?: ToneType;
      emailType?: EmailType;
      platform?: SocialPlatform;
    }
  ) => {
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
  
  // Set active feature category
  setActiveCategory: (category: AiFeatureCategory) => {
    set({ activeCategory: category });
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