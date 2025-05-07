'use client';

import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useModelStore, MODEL_OPTIONS } from '@/stores/modelStore';
import { Cpu, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';
import OpenAI from 'openai';

export function ModelSelector() {
  const { selectedModel, setModel, availableModels, addAvailableModel } = useModelStore();
  const [testing, setTesting] = useState(false);
  const [testedModel, setTestedModel] = useState<string | null>(null);
  
  // Find the currently selected model option
  const currentModel = MODEL_OPTIONS.find(model => model.id === selectedModel);

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setModel(modelId as any);
    toast.success(`Model changed to ${modelId}`);
  };

  // Test if a model is available with the current API key
  const testModel = async (modelId: string) => {
    if (testing) return;
    
    setTesting(true);
    setTestedModel(modelId);
    
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      
      await openai.chat.completions.create({
        model: modelId,
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 5
      });
      
      // If successful, add to available models
      addAvailableModel(modelId as any);
      toast.success(`Model ${modelId} is available with your API key!`);
    } catch (error) {
      toast.error(`Model ${modelId} is not available with your current API key.`);
      console.error(`Error testing model ${modelId}:`, error);
    } finally {
      setTesting(false);
      setTestedModel(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Cpu className="h-4 w-4" />
          {currentModel?.name || selectedModel}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {MODEL_OPTIONS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleModelChange(model.id)}
            >
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-gray-500">{model.description}</div>
              </div>
              {selectedModel === model.id && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-gray-500">
          Test which models your API key can access:
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {MODEL_OPTIONS.map((model) => (
            <DropdownMenuItem
              key={`test-${model.id}`}
              onClick={() => testModel(model.id)}
              disabled={testing}
              className="cursor-pointer"
            >
              <span className="text-xs">
                {testing && testedModel === model.id ? (
                  <span className="text-yellow-500">Testing {model.id}...</span>
                ) : availableModels.includes(model.id as any) ? (
                  <span className="text-green-500">✓ {model.id} (Available)</span>
                ) : (
                  <span>Test {model.id}</span>
                )}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 