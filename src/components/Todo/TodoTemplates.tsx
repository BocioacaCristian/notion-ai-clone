'use client';

import React, { useEffect } from 'react';
import { TodoTemplate } from '@/types';
import { useTodoStore } from '@/stores/todoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PlusCircle, ListTodo, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TodoTemplates() {
  const { templates, fetchTemplates, createListFromTemplate } = useTodoStore();
  const router = useRouter();
  
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  const handleCreateFromTemplate = (templateId: string) => {
    const newList = createListFromTemplate(templateId);
    if (newList) {
      router.push(`/todos/${newList.id}`);
    }
  };
  
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Todo Templates</h1>
          <p className="text-muted-foreground">
            Choose from pre-defined templates or create your own custom template.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create new template card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Template
              </CardTitle>
              <CardDescription>
                Start from scratch and create your own custom template
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/todos/templates/new')}
              >
                Create Template
              </Button>
            </CardFooter>
          </Card>
          
          {/* Template cards */}
          {templates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onUseTemplate={handleCreateFromTemplate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: TodoTemplate;
  onUseTemplate: (templateId: string) => void;
}

function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListTodo className="h-5 w-5 mr-2 text-primary" />
          {template.name}
        </CardTitle>
        <CardDescription>
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {template.todos.length} tasks
        </div>
        <div className="mt-2">
          <ul className="text-sm list-disc list-inside">
            {template.todos.slice(0, 3).map((todo, index) => (
              <li key={index} className="truncate">{todo.title}</li>
            ))}
            {template.todos.length > 3 && (
              <li className="text-muted-foreground">
                +{template.todos.length - 3} more tasks
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onUseTemplate(template.id)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
} 