'use client';

import React, { useEffect, useState } from 'react';
import { useTodoStore } from '@/stores/todoStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  PlusCircle, 
  List, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TodosPage() {
  const { todoLists, fetchTodoLists, addTodoList } = useTodoStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  
  useEffect(() => {
    fetchTodoLists();
  }, [fetchTodoLists]);
  
  const handleCreateList = () => {
    if (newListTitle.trim()) {
      addTodoList(newListTitle, newListDescription);
      setNewListTitle('');
      setNewListDescription('');
      setIsCreateDialogOpen(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Todo Lists</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks and stay organized
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/todos/templates" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto">
              <List className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </Link>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none w-full sm:w-auto">
                <PlusCircle className="h-4 w-4 mr-2" />
                New List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Todo List</DialogTitle>
                <DialogDescription>
                  Create a new list to organize your tasks
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter list title..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Input
                    id="description"
                    placeholder="Enter list description..."
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md p-4 bg-muted/10">
                  <div className="flex items-center mb-3">
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    <h3 className="text-sm font-medium">AI-powered list generation</h3>
                  </div>
                  <Input
                    placeholder="Describe what you want to accomplish..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mb-3"
                  />
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    disabled={!aiPrompt.trim()}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Generate Tasks
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateList} disabled={!newListTitle.trim()}>
                  Create List
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {todoLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <List className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-medium mb-3">No Todo Lists Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-center">
            Create your first todo list to start organizing your tasks and boost your productivity.
          </p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="px-8"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todoLists.map((list) => (
            <Link key={list.id} href={`/todos/${list.id}`} className="block group">
              <Card className="h-full hover:shadow-md transition-all duration-200 border-primary/10 group-hover:border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1">{list.title}</CardTitle>
                  {list.description && (
                    <CardDescription className="line-clamp-2">{list.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary/70" />
                      {list.todos.filter(t => t.status === 'Completed').length}/{list.todos.length} completed
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary/70" />
                      Updated {format(new Date(list.updatedAt), 'MMM d')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {/* "Add new list" card */}
          <Card 
            className="h-full border-dashed hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Create New List</h3>
              <p className="text-sm text-muted-foreground text-center">
                Add a new todo list to organize your tasks
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 