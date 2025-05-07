'use client';

import React from 'react';
import { Todo, TodoStatus, Priority } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Calendar, 
  Flag, 
  Trash, 
  Edit,
  ArrowRight,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTodoStore } from '@/stores/todoStore';

interface TodoItemProps {
  todo: Todo;
  listId?: string;
}

export function TodoItem({ todo, listId }: TodoItemProps) {
  const { editTodo, removeTodo, removeTodoFromList, suggestNextSteps } = useTodoStore();
  
  const handleStatusChange = (checked: boolean) => {
    editTodo(todo.id, { 
      status: checked ? TodoStatus.COMPLETED : TodoStatus.NEW 
    });
  };
  
  const handleDelete = () => {
    if (listId) {
      removeTodoFromList(listId, todo.id);
    } else {
      removeTodo(todo.id);
    }
  };
  
  const handleSuggestNextSteps = async () => {
    if (todo.status === TodoStatus.COMPLETED) {
      await suggestNextSteps(todo.id);
    }
  };
  
  const getPriorityColor = (priority: Priority | undefined) => {
    switch(priority) {
      case Priority.HIGH:
        return 'text-red-500 dark:text-red-400';
      case Priority.MEDIUM:
        return 'text-amber-500 dark:text-amber-400';
      case Priority.LOW:
        return 'text-green-500 dark:text-green-400';
      default:
        return 'text-gray-400 dark:text-gray-500';
    }
  };
  
  const getStatusClass = (status: TodoStatus) => {
    switch(status) {
      case TodoStatus.COMPLETED:
        return 'line-through text-muted-foreground';
      case TodoStatus.IN_PROGRESS:
        return 'font-medium text-blue-600 dark:text-blue-400';
      case TodoStatus.WAITING:
        return 'italic text-amber-600 dark:text-amber-400';
      case TodoStatus.OVERDUE:
        return 'font-medium text-red-600 dark:text-red-400';
      default:
        return '';
    }
  };
  
  return (
    <div className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors group border border-transparent hover:border-accent">
      <div className="pt-1">
        <Checkbox
          checked={todo.status === TodoStatus.COMPLETED}
          onCheckedChange={handleStatusChange}
          className={cn(
            todo.status === TodoStatus.COMPLETED ? "opacity-70" : "opacity-100"
          )}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium", getStatusClass(todo.status))}>
          {todo.title}
        </div>
        
        {todo.description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {todo.description}
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {todo.priority && (
            <div className="flex items-center text-xs">
              <Flag className={cn("h-3 w-3 mr-1", getPriorityColor(todo.priority))} />
              <span className="text-muted-foreground">{todo.priority}</span>
            </div>
          )}
          
          {todo.dueDate && (
            <div className={cn(
              "flex items-center text-xs",
              todo.status !== TodoStatus.COMPLETED && 
              new Date(todo.dueDate) < new Date() ? 
                "text-red-500 dark:text-red-400" : "text-muted-foreground"
            )}>
              <Clock className="h-3 w-3 mr-1" />
              <span>{format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {todo.assignee && (
            <div className="text-xs text-muted-foreground">
              <span className="inline-block bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {todo.assignee}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
        {todo.status === TodoStatus.COMPLETED && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
            onClick={handleSuggestNextSteps}
            title="Suggest next steps"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-accent">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" />
              Set Priority
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Set Due Date
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 focus:text-red-600 focus:dark:text-red-400"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 