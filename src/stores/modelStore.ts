import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GptModel, ModelOption } from '@/types';

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective model suitable for most tasks'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'More capable model for complex reasoning and understanding'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Enhanced version of GPT-4 with improved performance'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Newest model with the best performance but may be limited access'
  }
];

interface ModelState {
  selectedModel: GptModel;
  setModel: (model: GptModel) => void;
  availableModels: GptModel[];
  setAvailableModels: (models: GptModel[]) => void;
  addAvailableModel: (model: GptModel) => void;
  removeAvailableModel: (model: GptModel) => void;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      selectedModel: 'gpt-3.5-turbo',
      availableModels: ['gpt-3.5-turbo'],
      
      setModel: (model: GptModel) => set({ selectedModel: model }),
      
      setAvailableModels: (models: GptModel[]) => set({ availableModels: models }),
      
      addAvailableModel: (model: GptModel) => set((state) => ({
        availableModels: state.availableModels.includes(model) 
          ? state.availableModels 
          : [...state.availableModels, model]
      })),
      
      removeAvailableModel: (model: GptModel) => set((state) => ({
        availableModels: state.availableModels.filter(m => m !== model),
        // Reset to default model if the current selected model is removed
        selectedModel: model === state.selectedModel 
          ? 'gpt-3.5-turbo' 
          : state.selectedModel
      }))
    }),
    {
      name: 'notion-ai-model-settings',
    }
  )
); 