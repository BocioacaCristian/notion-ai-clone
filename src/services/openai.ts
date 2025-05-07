import OpenAI from 'openai';
import { 
  AiAction, 
  AiResponse, 
  PromptTemplate, 
  GptModel, 
  ToneType, 
  EmailType,
  SocialPlatform
} from '@/types';
import { isOpenAiKeyConfigured } from '@/utils/apiKeyHelper';

// Placeholder for missing API key
const MISSING_API_KEY_MESSAGE = 'OpenAI API key is missing. Add your key to .env.local to enable AI features.';

// Initialize OpenAI client with API key
// NOTE: In a production environment, this should be properly secured
let openai: OpenAI | null = null;

try {
  // Check if API key is available and valid
  if (isOpenAiKeyConfigured()) {
    openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Only for demo purposes
    });
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

// Prompt templates for different AI actions
const promptTemplates: PromptTemplate = {
  // Writing & Editing Tools
  'continue-writing': 'Continue the following text in a natural way: \n\n{{content}}',
  'summarize': 'Summarize the following text concisely: \n\n{{content}}',
  'fix-grammar': 'Fix the grammar and spelling errors in the following text: \n\n{{content}}',
  'translate': 'Translate the following text to {{language}}: \n\n{{content}}',
  'improve-writing': 'Improve the writing of the following text to make it more professional and clear: \n\n{{content}}',
  'make-shorter': 'Make the following text shorter while preserving its meaning: \n\n{{content}}',
  'make-longer': 'Expand the following text to make it more detailed and comprehensive: \n\n{{content}}',
  'change-tone': 'Rewrite the following text in a {{tone}} tone, preserving the original meaning: \n\n{{content}}',
  'simplify-language': 'Rewrite the following text using simpler language to make it more accessible and easier to understand: \n\n{{content}}',
  
  // Content Generation
  'generate-outline': 'Create a detailed outline for the following topic: \n\n{{content}}',
  'brainstorm-ideas': 'Generate a list of creative ideas related to the following topic: \n\n{{content}}',
  'create-list': 'Create a comprehensive list about the following topic: \n\n{{content}}',
  'create-table': 'Create a well-structured table with relevant data about: \n\n{{content}}',
  'draft-email': 'Write a {{emailType}} email about the following: \n\n{{content}}',
  'draft-social-post': 'Create a {{platform}} post about the following topic. Make it engaging and appropriate for the platform: \n\n{{content}}'
};

/**
 * Process text with OpenAI based on the specified action
 */
export async function processWithAI(
  content: string,
  action: AiAction,
  model: GptModel = 'gpt-3.5-turbo',
  options?: { 
    language?: string; 
    tone?: ToneType;
    emailType?: EmailType;
    platform?: SocialPlatform;
  }
): Promise<AiResponse> {
  // Check if OpenAI client is initialized
  if (!openai) {
    return {
      content: '',
      success: false,
      error: MISSING_API_KEY_MESSAGE,
    };
  }
  
  try {
    // Get the appropriate prompt template
    let promptTemplate = promptTemplates[action];
    
    // Replace placeholders in the template
    let prompt = promptTemplate.replace('{{content}}', content);
    
    // Handle special cases
    if (action === 'translate' && options?.language) {
      prompt = prompt.replace('{{language}}', options.language);
    }
    
    // Handle tone change
    if (action === 'change-tone' && options?.tone) {
      prompt = prompt.replace('{{tone}}', options.tone);
    }
    
    // Handle email type
    if (action === 'draft-email' && options?.emailType) {
      prompt = prompt.replace('{{emailType}}', options.emailType);
    }
    
    // Handle social platform
    if (action === 'draft-social-post' && options?.platform) {
      prompt = prompt.replace('{{platform}}', options.platform);
    }
    
    console.log(`Using model: ${model} for action: ${action}`);
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model, // Use the provided model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant that helps improve text and generate content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    // Extract and return the generated content
    const generatedContent = response.choices[0]?.message?.content || '';
    
    return {
      content: generatedContent,
      success: true,
    };
  } catch (error) {
    console.error('Error processing AI request:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process your request. Please try again.',
    };
  }
} 