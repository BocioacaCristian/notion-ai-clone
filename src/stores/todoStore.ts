import { create } from 'zustand';
import { Todo, TodoList, TodoStatus, TodoTemplate, Priority } from '@/types';
import {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTodoLists,
  getTodoList,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  addTodoToList,
  removeTodoFromList,
  getAllTodoTemplates,
  getTodoTemplate,
  createTodoTemplate,
  updateTodoTemplate,
  deleteTodoTemplate,
  createTodoListFromTemplate
} from '@/services/todo';
import { format } from 'date-fns';

interface TodoState {
  todos: Todo[];
  todoLists: TodoList[];
  templates: TodoTemplate[];
  activeTodoList: TodoList | null;
  activeTemplate: TodoTemplate | null;
  isLoading: boolean;
  error: string | null;
  
  // Todo actions
  fetchTodos: () => void;
  fetchTodo: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Todo;
  editTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  removeTodo: (id: string) => void;
  
  // Todo list actions
  fetchTodoLists: () => void;
  fetchTodoList: (id: string) => void;
  addTodoList: (title: string, description?: string) => TodoList;
  editTodoList: (id: string, updates: Partial<Omit<TodoList, 'id' | 'createdAt' | 'todos'>>) => void;
  removeTodoList: (id: string) => void;
  setActiveTodoList: (todoList: TodoList | null) => void;
  
  // Todo item in list actions
  addTodoToList: (listId: string, todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeTodoFromList: (listId: string, todoId: string) => void;
  
  // Template actions
  fetchTemplates: () => void;
  fetchTemplate: (id: string) => void;
  addTemplate: (name: string, description: string, todos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[]) => TodoTemplate;
  editTemplate: (id: string, updates: Partial<Omit<TodoTemplate, 'id'>>) => void;
  removeTemplate: (id: string) => void;
  setActiveTemplate: (template: TodoTemplate | null) => void;
  createListFromTemplate: (templateId: string, title?: string) => TodoList | null;
  
  // AI-related actions
  generateTodosFromPrompt: (prompt: string) => Promise<Todo[]>;
  prioritizeTodos: (todos: Todo[]) => Promise<Todo[]>;
  suggestNextSteps: (completedTodoId: string) => Promise<Todo[]>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  todoLists: [],
  templates: [],
  activeTodoList: null,
  activeTemplate: null,
  isLoading: false,
  error: null,
  
  // Todo actions
  fetchTodos: () => {
    try {
      const todos = getAllTodos();
      set({ todos, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch todos' });
    }
  },
  
  fetchTodo: (id: string) => {
    try {
      const todo = getTodo(id);
      if (todo) {
        set(state => ({
          todos: state.todos.find(t => t.id === id)
            ? state.todos.map(t => t.id === id ? todo : t)
            : [...state.todos, todo],
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to fetch todo' });
    }
  },
  
  addTodo: (todoData) => {
    try {
      const newTodo = createTodo(todoData);
      set(state => ({
        todos: [...state.todos, newTodo],
        error: null
      }));
      return newTodo;
    } catch (err) {
      set({ error: 'Failed to create todo' });
      throw err;
    }
  },
  
  editTodo: (id, updates) => {
    try {
      const updatedTodo = updateTodo(id, updates);
      if (updatedTodo) {
        set(state => ({
          todos: state.todos.map(todo => 
            todo.id === id ? updatedTodo : todo
          ),
          error: null
        }));
        
        // If the todo is part of a list, update that as well
        const { activeTodoList } = get();
        if (activeTodoList && activeTodoList.todos.some(todo => todo.id === id)) {
          set({
            activeTodoList: {
              ...activeTodoList,
              todos: activeTodoList.todos.map(todo => 
                todo.id === id ? updatedTodo : todo
              ),
              updatedAt: new Date()
            }
          });
        }
      }
    } catch (err) {
      set({ error: 'Failed to update todo' });
    }
  },
  
  removeTodo: (id) => {
    try {
      const success = deleteTodo(id);
      if (success) {
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
          error: null
        }));
        
        // If the todo is part of the active list, update that as well
        const { activeTodoList } = get();
        if (activeTodoList && activeTodoList.todos.some(todo => todo.id === id)) {
          set({
            activeTodoList: {
              ...activeTodoList,
              todos: activeTodoList.todos.filter(todo => todo.id !== id),
              updatedAt: new Date()
            }
          });
        }
      }
    } catch (err) {
      set({ error: 'Failed to delete todo' });
    }
  },
  
  // Todo list actions
  fetchTodoLists: () => {
    try {
      const todoLists = getAllTodoLists();
      set({ todoLists, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch todo lists' });
    }
  },
  
  fetchTodoList: (id: string) => {
    try {
      const todoList = getTodoList(id);
      if (todoList) {
        set(state => ({
          todoLists: state.todoLists.find(list => list.id === id)
            ? state.todoLists.map(list => list.id === id ? todoList : list)
            : [...state.todoLists, todoList],
          activeTodoList: todoList,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to fetch todo list' });
    }
  },
  
  addTodoList: (title, description) => {
    try {
      const newList = createTodoList(title, description);
      set(state => ({
        todoLists: [...state.todoLists, newList],
        activeTodoList: newList,
        error: null
      }));
      return newList;
    } catch (err) {
      set({ error: 'Failed to create todo list' });
      throw err;
    }
  },
  
  editTodoList: (id, updates) => {
    try {
      const updatedList = updateTodoList(id, updates);
      if (updatedList) {
        set(state => ({
          todoLists: state.todoLists.map(list => 
            list.id === id ? updatedList : list
          ),
          activeTodoList: state.activeTodoList?.id === id ? updatedList : state.activeTodoList,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to update todo list' });
    }
  },
  
  removeTodoList: (id) => {
    try {
      const success = deleteTodoList(id);
      if (success) {
        set(state => ({
          todoLists: state.todoLists.filter(list => list.id !== id),
          activeTodoList: state.activeTodoList?.id === id ? null : state.activeTodoList,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to delete todo list' });
    }
  },
  
  setActiveTodoList: (todoList) => {
    set({ activeTodoList: todoList });
  },
  
  // Todo item in list actions
  addTodoToList: (listId, todo) => {
    try {
      const updatedList = addTodoToList(listId, todo);
      if (updatedList) {
        set(state => ({
          todoLists: state.todoLists.map(list => 
            list.id === listId ? updatedList : list
          ),
          activeTodoList: state.activeTodoList?.id === listId ? updatedList : state.activeTodoList,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to add todo to list' });
    }
  },
  
  removeTodoFromList: (listId, todoId) => {
    try {
      const updatedList = removeTodoFromList(listId, todoId);
      if (updatedList) {
        set(state => ({
          todoLists: state.todoLists.map(list => 
            list.id === listId ? updatedList : list
          ),
          activeTodoList: state.activeTodoList?.id === listId ? updatedList : state.activeTodoList,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to remove todo from list' });
    }
  },
  
  // Template actions
  fetchTemplates: () => {
    try {
      const templates = getAllTodoTemplates();
      set({ templates, error: null });
    } catch (err) {
      set({ error: 'Failed to fetch templates' });
    }
  },
  
  fetchTemplate: (id: string) => {
    try {
      const template = getTodoTemplate(id);
      if (template) {
        set(state => ({
          templates: state.templates.find(t => t.id === id)
            ? state.templates.map(t => t.id === id ? template : t)
            : [...state.templates, template],
          activeTemplate: template,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to fetch template' });
    }
  },
  
  addTemplate: (name, description, todos) => {
    try {
      const newTemplate = createTodoTemplate(name, description, todos);
      set(state => ({
        templates: [...state.templates, newTemplate],
        activeTemplate: newTemplate,
        error: null
      }));
      return newTemplate;
    } catch (err) {
      set({ error: 'Failed to create template' });
      throw err;
    }
  },
  
  editTemplate: (id, updates) => {
    try {
      const updatedTemplate = updateTodoTemplate(id, updates);
      if (updatedTemplate) {
        set(state => ({
          templates: state.templates.map(template => 
            template.id === id ? updatedTemplate : template
          ),
          activeTemplate: state.activeTemplate?.id === id ? updatedTemplate : state.activeTemplate,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to update template' });
    }
  },
  
  removeTemplate: (id) => {
    try {
      const success = deleteTodoTemplate(id);
      if (success) {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
          activeTemplate: state.activeTemplate?.id === id ? null : state.activeTemplate,
          error: null
        }));
      }
    } catch (err) {
      set({ error: 'Failed to delete template' });
    }
  },
  
  setActiveTemplate: (template) => {
    set({ activeTemplate: template });
  },
  
  createListFromTemplate: (templateId, title) => {
    try {
      const newList = createTodoListFromTemplate(templateId, title);
      if (newList) {
        set(state => ({
          todoLists: [...state.todoLists, newList],
          activeTodoList: newList,
          error: null
        }));
      }
      return newList;
    } catch (err) {
      set({ error: 'Failed to create list from template' });
      return null;
    }
  },
  
  // AI-related actions
  generateTodosFromPrompt: async (prompt: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll simulate a response with some generic todos
      
      // Wait for a short time to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const generatedTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: `Task related to "${prompt.substring(0, 20)}..."`,
          description: `This is the first task generated from your prompt about ${prompt.substring(0, 30)}`,
          status: TodoStatus.NEW,
          priority: Priority.MEDIUM
        },
        {
          title: `Research ${prompt.substring(0, 15)}`,
          description: 'Research task generated by AI',
          status: TodoStatus.NEW,
          priority: Priority.HIGH
        },
        {
          title: `Review ${prompt.substring(0, 15)}`,
          description: 'Review task generated by AI',
          status: TodoStatus.NEW,
          priority: Priority.LOW
        },
        {
          title: `Implement ${prompt.substring(0, 15)}`,
          description: 'Implementation task generated by AI',
          status: TodoStatus.NEW
        }
      ];
      
      // Create todos and add them to state
      const createdTodos = generatedTodos.map(todo => createTodo(todo));
      
      set(state => ({
        todos: [...state.todos, ...createdTodos],
        isLoading: false
      }));
      
      return createdTodos;
    } catch (err) {
      set({ 
        error: 'Failed to generate todos from prompt',
        isLoading: false
      });
      return [];
    }
  },
  
  prioritizeTodos: async (todos: Todo[]) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate AI prioritization
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const prioritizedTodos = [...todos].map(todo => {
        const randomPriority = Math.floor(Math.random() * 3);
        const priority = randomPriority === 0 ? Priority.HIGH :
                         randomPriority === 1 ? Priority.MEDIUM :
                         Priority.LOW;
                         
        // Update the todo with the new priority
        const updated = updateTodo(todo.id, { priority });
        return updated || todo;
      }).filter(Boolean) as Todo[];
      
      // Update the store with prioritized todos
      set(state => ({
        todos: state.todos.map(todo => {
          const updatedTodo = prioritizedTodos.find(t => t.id === todo.id);
          return updatedTodo || todo;
        }),
        isLoading: false
      }));
      
      return prioritizedTodos;
    } catch (err) {
      set({ 
        error: 'Failed to prioritize todos',
        isLoading: false
      });
      return todos;
    }
  },
  
  suggestNextSteps: async (completedTodoId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Get the completed todo
      const completedTodo = getTodo(completedTodoId);
      if (!completedTodo) {
        throw new Error('Todo not found');
      }
      
      // Simulate AI suggestion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestedTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: `Follow-up on: ${completedTodo.title}`,
          description: `Next step after completing "${completedTodo.title}"`,
          status: TodoStatus.NEW,
          priority: Priority.MEDIUM
        },
        {
          title: `Review outcome of: ${completedTodo.title}`,
          description: 'Review the results of the completed task',
          status: TodoStatus.NEW,
          priority: Priority.LOW
        }
      ];
      
      // Create todos and add them to state
      const createdTodos = suggestedTodos.map(todo => createTodo(todo));
      
      set(state => ({
        todos: [...state.todos, ...createdTodos],
        isLoading: false
      }));
      
      return createdTodos;
    } catch (err) {
      set({ 
        error: 'Failed to suggest next steps',
        isLoading: false
      });
      return [];
    }
  }
})); 