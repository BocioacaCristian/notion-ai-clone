'use client';

import React from 'react';
import { useAiStore } from '@/stores/aiStore';
import { AiFeatureCategory } from '@/types';
import { WritingToolsTab } from '../writing-tools/WritingToolsTab';
import { ContentGenerationTab } from '../content-generation/ContentGenerationTab';
import { cn } from '@/lib/utils';

interface AiFeatureTabsProps {
  editor: any;
}

export function AiFeatureTabs({ editor }: AiFeatureTabsProps) {
  const { activeCategory, setActiveCategory } = useAiStore();

  const tabs: { label: string; value: AiFeatureCategory; icon: React.ReactNode }[] = [
    {
      label: 'Writing Tools',
      value: 'writing-tools',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
        </svg>
      ),
    },
    {
      label: 'Content Generation',
      value: 'content-generation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 3v12"></path>
          <path d="M16 7H8"></path>
          <path d="M3 5v14h18V5H3Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex gap-1 h-10">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative h-10 rounded-none border-b-2 border-b-transparent -mb-[2px]",
                activeCategory === tab.value
                  ? "border-b-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveCategory(tab.value)}
            >
              <div className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-1">
        {activeCategory === 'writing-tools' && <WritingToolsTab editor={editor} />}
        {activeCategory === 'content-generation' && <ContentGenerationTab editor={editor} />}
      </div>
    </div>
  );
} 