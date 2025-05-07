import OpenAI from 'openai';
import { AiAction, AiResponse, PromptTemplate, GptModel } from '@/types';
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
  'continue-writing': 'Continue the following text in a natural way: \n\n{{content}}',
  'summarize': 'Summarize the following text concisely: \n\n{{content}}',
  'fix-grammar': 'Fix the grammar and spelling errors in the following text: \n\n{{content}}',
  'translate': 'Translate the following text to {{language}}: \n\n{{content}}',
  'improve-writing': 'Improve the writing of the following text to make it more professional and clear: \n\n{{content}}',
  'make-shorter': 'Make the following text shorter while preserving its meaning: \n\n{{content}}',
  'make-longer': 'Expand the following text to make it more detailed and comprehensive: \n\n{{content}}',
};

/**
 * Process text with OpenAI based on the specified action
 */
export async function processWithAI(
  content: string,
  action: AiAction,
  model: GptModel = 'gpt-3.5-turbo',
  options?: { language?: string }
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
    
    // Handle special cases like translation
    if (action === 'translate' && options?.language) {
      prompt = prompt.replace('{{language}}', options.language);
    }
    
    console.log(`Using model: ${model} for action: ${action}`);
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model, // Use the provided model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful writing assistant that helps improve text.',
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