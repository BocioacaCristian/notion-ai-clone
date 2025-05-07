export type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AiAction = 
  | 'continue-writing'
  | 'summarize'
  | 'fix-grammar'
  | 'translate'
  | 'improve-writing'
  | 'make-shorter'
  | 'make-longer';

export type AiResponse = {
  content: string;
  success: boolean;
  error?: string;
};

export type PromptTemplate = {
  [key in AiAction]: string;
};

export type GptModel = 
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o';

export interface ModelOption {
  id: GptModel;
  name: string;
  description: string;
} 