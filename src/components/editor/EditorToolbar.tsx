'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { type Editor as EditorType } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Code,
  List,
  ListOrdered,
  Link,
  Undo,
  Redo
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }
  
  return (
    <div className="border border-b-0 border-border/40 rounded-t-md bg-card/20 backdrop-blur-sm px-3 py-1.5 flex flex-wrap items-center gap-0.5 shadow-sm">
      <div className="flex items-center mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="w-px h-5 bg-border/60 mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('bold') ? 'bg-muted text-foreground' : ''
        }`}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('italic') ? 'bg-muted text-foreground' : ''
        }`}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      
      <div className="w-px h-5 bg-border/60 mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('heading', { level: 1 }) ? 'bg-muted text-foreground' : ''
        }`}
        title="Heading 1"
      >
        <Heading1 className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted text-foreground' : ''
        }`}
        title="Heading 2"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('codeBlock') ? 'bg-muted text-foreground' : ''
        }`}
        title="Code Block"
      >
        <Code className="h-3.5 w-3.5" />
      </Button>
      
      <div className="w-px h-5 bg-border/60 mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('bulletList') ? 'bg-muted text-foreground' : ''
        }`}
        title="Bullet List"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('orderedList') ? 'bg-muted text-foreground' : ''
        }`}
        title="Ordered List"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>
      
      <div className="w-px h-5 bg-border/60 mx-1" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`h-8 w-8 text-muted-foreground hover:text-foreground ${
          editor.isActive('link') ? 'bg-muted text-foreground' : ''
        }`}
        title="Add Link"
      >
        <Link className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
} 