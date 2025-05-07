'use client';

import React, { useEffect } from 'react';
import { useTodoStore } from '@/stores/todoStore';
import { TodoList } from '@/components/Todo/TodoList';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Calendar, 
  ListFilter, 
  MoreHorizontal,
  Sparkles,
  AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TodoListPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const { 
    activeTodoList, 
    fetchTodoList,
    generateTodosFromPrompt,
    prioritizeTodos,
    isLoading,
    error
  } = useTodoStore();
  
  useEffect(() => {
    if (id) {
      fetchTodoList(id);
    }
  }, [id, fetchTodoList]);
  
  const handleGenerateAITasks = async () => {
    if (activeTodoList) {
      const prompt = window.prompt("What would you like help with?");
      if (prompt) {
        await generateTodosFromPrompt(prompt);
      }
    }
  };
  
  const handleAIPrioritize = async () => {
    if (activeTodoList) {
      const uncompletedTodos = activeTodoList.todos.filter(
        todo => todo.status !== 'Completed'
      );
      await prioritizeTodos(uncompletedTodos);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link href="/todos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lists
          </Button>
        </Link>
        
        {activeTodoList && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAIPrioritize}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Prioritize
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGenerateAITasks}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Tasks
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-red-800 dark:text-red-300 text-sm">{error}</div>
        </div>
      )}
      
      {isLoading && !activeTodoList ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-48 mb-4"></div>
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-md w-full max-w-3xl"></div>
          </div>
        </div>
      ) : !activeTodoList ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-medium mb-3">Todo List Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-center">
            The todo list you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/todos">
            <Button size="lg" className="px-8">
              Return to Todo Lists
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card p-6 sm:p-8 rounded-xl border shadow-sm">
          <TodoList todoList={activeTodoList} />
        </div>
      )}
    </div>
  );
} 