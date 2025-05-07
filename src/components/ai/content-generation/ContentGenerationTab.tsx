'use client';

import React, { useState } from 'react';
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
  ListTree,
  Lightbulb,
  ListOrdered,
  Table,
  Mail,
  Share2,
  ChevronDown,
  Check,
  SendHorizonal
} from 'lucide-react';
import { useAiStore } from '@/stores/aiStore';
import { ContentGenerationAction, EmailType, SocialPlatform } from '@/types';
import { toast } from 'sonner';
import { Input } from '../../../components/ui/input';

interface ContentGenerationTabProps {
  editor: Editor | null;
}

export function ContentGenerationTab({ editor }: ContentGenerationTabProps) {
  const { isProcessing, processContent } = useAiStore();
  const [topic, setTopic] = useState('');
  const [selectedEmailType, setSelectedEmailType] = useState<EmailType>('professional');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('twitter');
  
  const contentActions = [
    { name: 'Generate Outline', value: 'generate-outline', icon: <ListTree className="h-4 w-4" />, description: 'Create a structured outline' },
    { name: 'Brainstorm Ideas', value: 'brainstorm-ideas', icon: <Lightbulb className="h-4 w-4" />, description: 'Get creative ideas' },
    { name: 'Create List', value: 'create-list', icon: <ListOrdered className="h-4 w-4" />, description: 'Generate a comprehensive list' },
    { name: 'Create Table', value: 'create-table', icon: <Table className="h-4 w-4" />, description: 'Create a structured table' },
  ];
  
  const emailTypes: { label: string; value: EmailType }[] = [
    { label: 'Professional', value: 'professional' },
    { label: 'Sales', value: 'sales' },
    { label: 'Follow-up', value: 'follow-up' },
    { label: 'Introduction', value: 'introduction' },
    { label: 'Thank You', value: 'thank-you' },
  ];
  
  const socialPlatforms: { label: string; value: SocialPlatform }[] = [
    { label: 'Twitter', value: 'twitter' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Facebook', value: 'facebook' },
  ];
  
  const handleContentGeneration = async (action: ContentGenerationAction) => {
    if (!editor || isProcessing) return;
    
    // For content generation, we use the topic if provided, or the selected text
    let content = topic;
    
    if (!content) {
      content = editor.state.selection.empty
        ? editor.getText()
        : editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
          );
    }
    
    if (!content) {
      toast.error('No Topic Provided', {
        description: 'Please enter a topic or select text to generate content',
      });
      return;
    }
    
    // Set options based on action type
    let options;
    if (action === 'draft-email') {
      options = { emailType: selectedEmailType };
    } else if (action === 'draft-social-post') {
      options = { platform: selectedPlatform };
    }
    
    // Process with AI
    const response = await processContent(content, action, options);
    
    if (response.success && response.content) {
      // Insert at cursor position
      editor
        .chain()
        .focus()
        .insertContent(response.content)
        .run();
      
      // Clear topic after successful generation
      setTopic('');
      toast.success('Content generated successfully');
    } else if (response.error) {
      toast.error('Content Generation Failed', {
        description: response.error,
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-3">
      {/* Topic input */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Enter a topic for content generation..."
          value={topic}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
          className="flex-1 text-sm"
        />
        <Button 
          size="sm" 
          variant="outline" 
          disabled={!topic.trim() || isProcessing}
          onClick={() => topic.trim() && handleContentGeneration('brainstorm-ideas')}
          title="Generate ideas from this topic"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Content generation actions */}
      <div className="space-y-1">
        {contentActions.map((action) => (
          <Button
            key={action.value}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-auto py-2 px-2 font-normal text-left"
            disabled={isProcessing}
            onClick={() => handleContentGeneration(action.value as ContentGenerationAction)}
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
        ))}
      </div>
      
      {/* Email and social media drafting */}
      <div className="border-t mt-1 pt-3 border-gray-200 dark:border-gray-700">
        {/* Email type dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto py-2 px-2 font-normal text-left mb-1"
            >
              <div className="flex items-start">
                <div className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Draft Email</span>
                  <span className="text-xs text-muted-foreground">Type: {selectedEmailType}</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {emailTypes.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => {
                  setSelectedEmailType(type.value);
                  handleContentGeneration('draft-email');
                }}
                className="flex items-center justify-between"
                disabled={isProcessing}
              >
                {type.label}
                {type.value === selectedEmailType && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Social platform dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto py-2 px-2 font-normal text-left"
            >
              <div className="flex items-start">
                <div className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Draft Social Post</span>
                  <span className="text-xs text-muted-foreground">Platform: {selectedPlatform}</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            {socialPlatforms.map((platform) => (
              <DropdownMenuItem
                key={platform.value}
                onClick={() => {
                  setSelectedPlatform(platform.value);
                  handleContentGeneration('draft-social-post');
                }}
                className="flex items-center justify-between"
                disabled={isProcessing}
              >
                {platform.label}
                {platform.value === selectedPlatform && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isProcessing && (
        <div className="mt-2 bg-primary/5 rounded-md p-2 text-center text-sm text-muted-foreground flex items-center justify-center">
          <Sparkles className="animate-pulse h-4 w-4 mr-1 text-primary" />
          Generating content...
        </div>
      )}
    </div>
  );
} 