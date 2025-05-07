'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  FileText,
  Check,
  MessageSquare,
  BookOpen,
  Wand2
} from 'lucide-react';
import { WritingToolsAction, ToneType } from '@/types';
import { useAiStore } from '@/stores/aiStore';
import { toast } from 'sonner';

interface WritingToolsTabProps {
  editor: Editor | null;
}

export function WritingToolsTab({ editor }: WritingToolsTabProps) {
  const { isProcessing, processContent } = useAiStore();
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [selectedTone, setSelectedTone] = useState<ToneType>('professional');
  
  // Track text selection state
  const [hasTextSelection, setHasTextSelection] = useState(false);
  
  // Update selection state when editor selection changes
  useEffect(() => {
    if (!editor) return;
    
    const updateSelectionState = () => {
      const hasSelection = !editor.state.selection.empty;
      console.log('Selection state updated:', {
        hasSelection,
        editorExists: !!editor,
        editorHTML: editor.getHTML(),
        textContent: editor.getText(),
        isEmpty: editor.isEmpty
      });
      setHasTextSelection(hasSelection);
    };
    
    // Initial check
    updateSelectionState();
    
    // Add selection change listener
    editor.on('selectionUpdate', updateSelectionState);
    editor.on('update', updateSelectionState);
    
    // Cleanup
    return () => {
      editor.off('selectionUpdate', updateSelectionState);
      editor.off('update', updateSelectionState);
    };
  }, [editor]);
  
  const writingToolActions = [
    { name: 'Continue writing', value: 'continue-writing', icon: <PenTool className="h-4 w-4" />, description: 'Have AI continue your text' },
    { name: 'Summarize', value: 'summarize', icon: <FileText className="h-4 w-4" />, description: 'Condense your text into a summary' },
    { name: 'Fix grammar', value: 'fix-grammar', icon: <Check className="h-4 w-4" />, description: 'Correct spelling and grammar errors' },
    { name: 'Improve writing', value: 'improve-writing', icon: <Wand2 className="h-4 w-4" />, description: 'Make your writing more professional' },
    { name: 'Make shorter', value: 'make-shorter', icon: <Scissors className="h-4 w-4" />, description: 'Condense your text' },
    { name: 'Make longer', value: 'make-longer', icon: <Plus className="h-4 w-4" />, description: 'Expand on your text' },
    { name: 'Simplify language', value: 'simplify-language', icon: <BookOpen className="h-4 w-4" />, description: 'Make text easier to understand' },
  ];
  
  const languages = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese', 'Chinese', 'Russian'];
  
  const tones: { label: string; value: ToneType }[] = [
    { label: 'Professional', value: 'professional' },
    { label: 'Casual', value: 'casual' },
    { label: 'Friendly', value: 'friendly' },
    { label: 'Formal', value: 'formal' },
    { label: 'Academic', value: 'academic' },
  ];
  
  const handleAction = async (action: WritingToolsAction) => {
    if (!editor || isProcessing) return;
    
    try {
      console.log('Editor state before processing:', {
        html: editor.getHTML(),
        text: editor.getText(),
        isActive: editor.isActive,
        isEmpty: editor.isEmpty,
        selection: {
          empty: editor.state.selection.empty,
          ranges: editor.state.selection.ranges
        }
      });
      
      // Check for empty editor (more thorough check)
      const editorHtml = editor.getHTML();
      const editorText = editor.getText();
      const isEditorEmpty = 
        editorHtml === '<p></p>' || 
        editorHtml === '' || 
        editorText.trim() === '';
      
      if (isEditorEmpty) {
        console.log('Editor is empty, cannot process');
        toast.error('No text in document', {
          description: 'Please write something first',
        });
        return;
      }
      
      // Get selected text or entire editor content
      const selectedText = editor.state.selection.empty
        ? editorText
        : editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
          );
      
      console.log('Processing text:', {
        selectedText,
        action,
        options: action === 'translate' ? { language: selectedLanguage } :
                action === 'change-tone' ? { tone: selectedTone } : {}
      });
      
      // For translation or tone change, add appropriate options
      let options;
      if (action === 'translate') {
        options = { language: selectedLanguage };
      } else if (action === 'change-tone') {
        options = { tone: selectedTone };
      }
      
      // Process with AI
      const response = await processContent(selectedText, action, options);
      console.log('AI response:', response);
      
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
        
        toast.success('AI action completed successfully');
      } else if (response.error) {
        // Show error toast
        toast.error('AI Processing Failed', {
          description: response.error,
        });
      }
    } catch (error) {
      console.error('Error processing content:', error);
      toast.error('Something went wrong', {
        description: 'Failed to process your content',
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className={`text-xs mb-2 p-2 rounded ${hasTextSelection ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'}`}>
          <div className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>
              {hasTextSelection 
                ? 'AI will process selected text' 
                : 'AI will process entire document'}
            </span>
          </div>
        </div>
      )}
      
      {/* Main actions */}
      {writingToolActions.map((action) => (
        <div key={action.value} className="mb-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-auto py-2 px-2 font-normal text-left"
            disabled={isProcessing}
            onClick={() => handleAction(action.value as WritingToolsAction)}
          >
            <div className="flex items-start">
              <div className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                {action.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{action.name}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </div>
          </Button>
        </div>
      ))}
      
      <div className="border-t my-2 pt-2 border-gray-200 dark:border-gray-700">
        {/* Tone selection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto py-2 px-2 font-normal text-left"
            >
              <div className="flex items-start">
                <div className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Change tone</span>
                  <span className="text-xs text-muted-foreground">Current: {selectedTone}</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {tones.map((tone) => (
              <DropdownMenuItem
                key={tone.value}
                onClick={() => {
                  setSelectedTone(tone.value);
                  handleAction('change-tone');
                }}
                className="flex items-center justify-between"
                disabled={isProcessing}
              >
                {tone.label}
                {tone.value === selectedTone && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Translation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto py-2 px-2 font-normal text-left"
            >
              <div className="flex items-start">
                <div className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                  <Languages className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Translate</span>
                  <span className="text-xs text-muted-foreground">Current: {selectedLanguage}</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language}
                onClick={() => {
                  setSelectedLanguage(language);
                  handleAction('translate');
                }}
                className="flex items-center justify-between"
                disabled={isProcessing}
              >
                {language}
                {language === selectedLanguage && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isProcessing && (
        <div className="mt-2 bg-primary/5 rounded-md p-2 text-center text-sm text-muted-foreground flex items-center justify-center">
          <Sparkles className="animate-pulse h-4 w-4 mr-1 text-primary" />
          Processing your request...
        </div>
      )}
    </div>
  );
} 