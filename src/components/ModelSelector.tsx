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
import { Cpu, ChevronDown, Check, Sparkles } from 'lucide-react';
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
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5 border-border/60 shadow-sm hover:shadow bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5">
            {currentModel?.id.includes('gpt-4') ? (
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">
              {currentModel?.name || selectedModel}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 shadow-lg border-border/50 bg-card/95 backdrop-blur-sm p-1">
        <DropdownMenuLabel className="text-xs font-medium px-2 py-1.5 text-muted-foreground">
          Select AI Model
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/40 my-1" />
        <DropdownMenuGroup className="space-y-0.5">
          {MODEL_OPTIONS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              className="flex justify-between items-center gap-3 py-2 px-2 rounded-sm cursor-pointer text-sm"
              onClick={() => handleModelChange(model.id)}
            >
              <div className="flex gap-2 items-start">
                {model.id.includes('gpt-4') ? (
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 mt-0.5" />
                ) : (
                  <Cpu className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <div className="font-medium text-xs">{model.name}</div>
                  <div className="text-[10px] text-muted-foreground">{model.description}</div>
                </div>
              </div>
              {selectedModel === model.id && (
                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/40 my-1" />
        <DropdownMenuLabel className="text-[10px] text-muted-foreground px-2 py-1">
          Available models with your API key:
        </DropdownMenuLabel>
        <DropdownMenuGroup className="space-y-0.5 mt-1">
          {MODEL_OPTIONS.map((model) => (
            <DropdownMenuItem
              key={`test-${model.id}`}
              onClick={() => testModel(model.id)}
              disabled={testing}
              className="px-2 py-1 cursor-pointer rounded-sm"
            >
              <span className="text-[10px] flex items-center gap-1.5">
                {testing && testedModel === model.id ? (
                  <span className="text-amber-500 flex items-center gap-1.5">
                    <div className="animate-pulse h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    Testing {model.id}...
                  </span>
                ) : availableModels.includes(model.id as any) ? (
                  <span className="text-green-500 flex items-center gap-1.5">
                    <Check className="h-3 w-3" />
                    {model.id}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full border border-muted-foreground/40"></div>
                    Test {model.id}
                  </span>
                )}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 