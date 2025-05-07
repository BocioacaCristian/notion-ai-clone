'use client';

import React, { useState } from 'react';
import { Todo, TodoList as TodoListType, TodoStatus } from '@/types';
import { useTodoStore } from '@/stores/todoStore';
import { TodoItem } from './TodoItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Calendar, 
  ListFilter, 
  MoreHorizontal, 
  Sparkles,
  CheckCircle,
  ClipboardList
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface TodoListProps {
  todoList: TodoListType;
}

export function TodoList({ todoList }: TodoListProps) {
  const { addTodoToList, editTodoList, isLoading } = useTodoStore();
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  
  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodoToList(todoList.id, {
        title: newTodoTitle,
        status: TodoStatus.NEW
      });
      setNewTodoTitle('');
      setIsAddingTodo(false);
    }
  };
  
  const handleTitleEdit = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent;
    if (newTitle && newTitle !== todoList.title) {
      editTodoList(todoList.id, { title: newTitle });
    }
  };
  
  // Group todos by status
  const todosByStatus = todoList.todos.reduce((acc, todo) => {
    const status = todo.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(todo);
    return acc;
  }, {} as Record<TodoStatus, Todo[]>);
  
  const renderTodoGroup = (title: string, todos: Todo[]) => {
    if (!todos || todos.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium flex items-center mb-3 text-muted-foreground">
          <span>{title}</span>
          <span className="ml-2 text-xs py-0.5 px-2 bg-primary/10 rounded-full">
            {todos.length}
          </span>
        </h3>
        <div className="space-y-1.5 rounded-lg border bg-card/50 p-2">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} listId={todoList.id} />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 
          className="text-2xl font-bold focus:outline-none focus:ring-0 focus:border-b-2 focus:border-primary/50 pb-0.5 hover:border-b-2 hover:border-primary/30" 
          contentEditable 
          suppressContentEditableWarning
          onBlur={handleTitleEdit}
        >
          {todoList.title}
        </h2>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>
                <ListFilter className="h-4 w-4 mr-2" />
                Change View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 focus:dark:text-red-400">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {todoList.description && (
        <p className="text-muted-foreground mb-8 sm:w-3/4">{todoList.description}</p>
      )}
      
      {/* Add task input */}
      <div className="mb-8">
        {isAddingTodo ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border rounded-lg bg-card shadow-sm transition-all duration-200">
            <Input
              placeholder="Enter todo title..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTodo();
                } else if (e.key === 'Escape') {
                  setIsAddingTodo(false);
                  setNewTodoTitle('');
                }
              }}
              autoFocus
            />
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <Button 
                onClick={handleAddTodo} 
                size="sm" 
                className="flex-1 sm:flex-none"
                disabled={!newTodoTitle.trim() || isLoading}
              >
                Add Task
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  setIsAddingTodo(false);
                  setNewTodoTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full justify-start border-dashed border hover:border-primary/30 hover:bg-primary/5 h-12 transition-all duration-200"
            onClick={() => setIsAddingTodo(true)}
          >
            <PlusCircle className="h-5 w-5 mr-2 text-primary" />
            Add new task
          </Button>
        )}
      </div>
      
      {/* Render todos grouped by status */}
      {renderTodoGroup('Not Started', todosByStatus[TodoStatus.NEW])}
      {renderTodoGroup('In Progress', todosByStatus[TodoStatus.IN_PROGRESS])}
      {renderTodoGroup('Waiting On', todosByStatus[TodoStatus.WAITING])}
      {renderTodoGroup('Completed', todosByStatus[TodoStatus.COMPLETED])}
      {renderTodoGroup('Overdue', todosByStatus[TodoStatus.OVERDUE])}
      
      {todoList.todos.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg bg-card/50 transition-all hover:bg-card/70">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto">
            Add your first task to get started with this todo list.
          </p>
          <Button 
            onClick={() => setIsAddingTodo(true)}
            size="sm"
            className="mx-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add a Task
          </Button>
        </div>
      )}
    </div>
  );
} 