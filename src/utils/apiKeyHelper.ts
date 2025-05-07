/**
 * Check if the OpenAI API key is available and valid
 */
export function isOpenAiKeyConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  // Check if API key exists and is not the placeholder value
  return !!apiKey && apiKey !== 'your_openai_api_key_here';
}

/**
 * Get a user-friendly message about API key status
 */
export function getApiKeyStatusMessage(): string {
  if (isOpenAiKeyConfigured()) {
    return 'OpenAI API key is configured.';
  }
  
  return 'OpenAI API key is missing. Add your key to .env.local to enable AI features.';
} 