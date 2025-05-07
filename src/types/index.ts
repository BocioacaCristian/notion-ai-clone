export type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// AI Action Categories
export type WritingToolsAction = 
  | 'continue-writing'
  | 'summarize'
  | 'fix-grammar'
  | 'translate'
  | 'improve-writing'
  | 'make-shorter'
  | 'make-longer'
  | 'change-tone'
  | 'simplify-language';

export type ContentGenerationAction =
  | 'generate-outline'
  | 'brainstorm-ideas'
  | 'create-list'
  | 'create-table'
  | 'draft-email'
  | 'draft-social-post';

export type AiAction = WritingToolsAction | ContentGenerationAction;

export type AiFeatureCategory = 'writing-tools' | 'content-generation';

export type ToneType =
  | 'professional'
  | 'casual'
  | 'friendly'
  | 'formal'
  | 'academic';

export type EmailType =
  | 'professional'
  | 'sales'
  | 'follow-up'
  | 'introduction'
  | 'thank-you';

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'facebook';

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