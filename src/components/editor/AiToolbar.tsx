'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Sparkles, 
  PenTool, 
  Scissors, 
  Languages, 
  Plus, 
  ChevronDown,
  FileDigit,
  Check,
  AlertTriangle,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { AiAction, ToneType } from '@/types';
import { useAiStore } from '@/stores/aiStore';
import { toast } from 'sonner';
import { ModelSelector } from '@/components/ModelSelector';

interface AiToolbarProps {
  editor: Editor | null;
}

export function AiToolbar({ editor }: AiToolbarProps) {
  const { isProcessing, processContent, error } = useAiStore();
  const [showTranslateOptions, setShowTranslateOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [selectedTone, setSelectedTone] = useState<ToneType>('professional');
  
  // Show toast if there's an error related to API key
  useEffect(() => {
    if (error && error.includes('OpenAI API key')) {
      toast.error('OpenAI API Key Missing', {
        description: 'Please add your OpenAI API key to .env.local file to use AI features',
        duration: 5000,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      });
    }
  }, [error]);
  
  if (!editor) {
    return null;
  }
  
  const aiActions = [
    { name: 'Continue writing', value: 'continue-writing', icon: <PenTool className="h-4 w-4 mr-2" /> },
    { name: 'Summarize', value: 'summarize', icon: <FileDigit className="h-4 w-4 mr-2" /> },
    { name: 'Fix grammar', value: 'fix-grammar', icon: <Check className="h-4 w-4 mr-2" /> },
    { name: 'Improve writing', value: 'improve-writing', icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { name: 'Make shorter', value: 'make-shorter', icon: <Scissors className="h-4 w-4 mr-2" /> },
    { name: 'Make longer', value: 'make-longer', icon: <Plus className="h-4 w-4 mr-2" /> },
    { name: 'Simplify language', value: 'simplify-language', icon: <BookOpen className="h-4 w-4 mr-2" /> },
  ];
  
  const languages = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Russian'];
  
  const tones: { label: string; value: ToneType }[] = [
    { label: 'Professional', value: 'professional' },
    { label: 'Casual', value: 'casual' },
    { label: 'Friendly', value: 'friendly' },
    { label: 'Formal', value: 'formal' },
    { label: 'Academic', value: 'academic' },
  ];
  
  const handleAiAction = async (action: AiAction) => {
    if (!editor || isProcessing) return;
    
    // Get selected text or entire editor content
    const selectedText = editor.state.selection.empty
      ? editor.getText()
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        );
    
    if (!selectedText) return;
    
    // For translation or tone change, add appropriate options
    let options;
    if (action === 'translate') {
      options = { language: selectedLanguage };
    } else if (action === 'change-tone') {
      options = { tone: selectedTone };
    }
    
    // Process with AI
    const response = await processContent(selectedText, action, options);
    
    if (response.success && response.content) {
      // Replace selected text with AI result
      if (!editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(response.content)
          .run();
      } else {
        // If no selection, replace entire content
        editor
          .chain()
          .focus()
          .setContent(response.content)
          .run();
      }
    } else if (response.error) {
      // Show error toast
      toast.error('AI Processing Failed', {
        description: response.error,
        duration: 5000,
      });
    }
  };
  
  return (
    <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-gray-50 dark:bg-gray-800 p-2 flex flex-wrap gap-1 items-center">
      {/* AI Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 items-center">
            <Sparkles className="h-4 w-4" />
            AI Actions
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>AI Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {aiActions.map((action) => (
              <DropdownMenuItem
                key={action.value}
                disabled={isProcessing}
                onClick={() => handleAiAction(action.value as AiAction)}
              >
                {action.icon}
                {action.name}
                {isProcessing && action.value === 'processing' && (
                  <span className="ml-auto animate-spin">...</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setShowTranslateOptions(true)}
              disabled={isProcessing}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to {selectedLanguage}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Tone Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 items-center">
            <MessageSquare className="h-4 w-4" />
            Tone: {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>Select Tone</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tones.map((tone) => (
            <DropdownMenuItem
              key={tone.value}
              onClick={() => setSelectedTone(tone.value)}
              className="flex items-center justify-between"
            >
              {tone.label}
              {tone.value === selectedTone && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleAiAction('change-tone')}
            disabled={isProcessing}
            className="bg-primary/10 hover:bg-primary/20"
          >
            Apply Tone Change
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showTranslateOptions && (
        <DropdownMenu
          defaultOpen={true}
          onOpenChange={(open) => !open && setShowTranslateOptions(false)}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Select Language</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language}
                onClick={() => {
                  setSelectedLanguage(language);
                  setShowTranslateOptions(false);
                  handleAiAction('translate');
                }}
              >
                {language}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* Model Selector */}
      <div className="ml-2">
        <ModelSelector />
      </div>
      
      {isProcessing && (
        <div className="inline-flex ml-auto items-center text-sm text-gray-500 dark:text-gray-400">
          <Sparkles className="animate-pulse h-4 w-4 mr-1" />
          Processing...
        </div>
      )}
    </div>
  );
} 