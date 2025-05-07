export type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// Todo Types
export enum TodoStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  WAITING = 'Waiting on',
  OVERDUE = 'Overdue'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type Todo = {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority?: Priority;
  dueDate?: Date;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // For sub-tasks
};

export type TodoList = {
  id: string;
  title: string;
  description?: string;
  todos: Todo[];
  createdAt: Date;
  updatedAt: Date;
};

export type TodoTemplate = {
  id: string;
  name: string;
  description: string;
  todos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[];
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