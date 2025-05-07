import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoList, TodoStatus, TodoTemplate } from '@/types';

const TODO_STORAGE_KEY = 'notion_ai_clone_todos';
const TODO_LIST_STORAGE_KEY = 'notion_ai_clone_todo_lists';
const TODO_TEMPLATE_STORAGE_KEY = 'notion_ai_clone_todo_templates';

// Helper functions for local storage
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// TODO Management
export const getAllTodos = (): Todo[] => {
  return getFromStorage<Todo>(TODO_STORAGE_KEY);
};

export const getTodo = (id: string): Todo | null => {
  const todos = getAllTodos();
  return todos.find(todo => todo.id === id) || null;
};

export const createTodo = (
  todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Todo => {
  const newTodo: Todo = {
    id: uuidv4(),
    ...todoData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const todos = getAllTodos();
  todos.push(newTodo);
  saveToStorage(TODO_STORAGE_KEY, todos);
  
  return newTodo;
};

export const updateTodo = (
  id: string,
  updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo | null => {
  const todos = getAllTodos();
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) return null;
  
  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  todos[todoIndex] = updatedTodo;
  saveToStorage(TODO_STORAGE_KEY, todos);
  
  return updatedTodo;
};

export const deleteTodo = (id: string): boolean => {
  const todos = getAllTodos();
  const filteredTodos = todos.filter(todo => todo.id !== id);
  
  if (filteredTodos.length === todos.length) return false;
  
  saveToStorage(TODO_STORAGE_KEY, filteredTodos);
  return true;
};

// TODO List Management
export const getAllTodoLists = (): TodoList[] => {
  return getFromStorage<TodoList>(TODO_LIST_STORAGE_KEY);
};

export const getTodoList = (id: string): TodoList | null => {
  const lists = getAllTodoLists();
  return lists.find(list => list.id === id) || null;
};

export const createTodoList = (
  title: string,
  description?: string,
  initialTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = []
): TodoList => {
  const now = new Date();
  
  const todos = initialTodos.map(todo => ({
    id: uuidv4(),
    ...todo,
    createdAt: now,
    updatedAt: now
  }));
  
  const newList: TodoList = {
    id: uuidv4(),
    title,
    description,
    todos,
    createdAt: now,
    updatedAt: now
  };
  
  const lists = getAllTodoLists();
  lists.push(newList);
  saveToStorage(TODO_LIST_STORAGE_KEY, lists);
  
  return newList;
};

export const updateTodoList = (
  id: string,
  updates: Partial<Omit<TodoList, 'id' | 'createdAt' | 'todos'>>
): TodoList | null => {
  const lists = getAllTodoLists();
  const listIndex = lists.findIndex(list => list.id === id);
  
  if (listIndex === -1) return null;
  
  const updatedList = {
    ...lists[listIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  lists[listIndex] = updatedList;
  saveToStorage(TODO_LIST_STORAGE_KEY, lists);
  
  return updatedList;
};

export const deleteTodoList = (id: string): boolean => {
  const lists = getAllTodoLists();
  const filteredLists = lists.filter(list => list.id !== id);
  
  if (filteredLists.length === lists.length) return false;
  
  saveToStorage(TODO_LIST_STORAGE_KEY, filteredLists);
  return true;
};

export const addTodoToList = (
  listId: string,
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): TodoList | null => {
  const lists = getAllTodoLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) return null;
  
  const newTodo: Todo = {
    id: uuidv4(),
    ...todo,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  lists[listIndex].todos.push(newTodo);
  lists[listIndex].updatedAt = new Date();
  
  saveToStorage(TODO_LIST_STORAGE_KEY, lists);
  return lists[listIndex];
};

export const removeTodoFromList = (
  listId: string,
  todoId: string
): TodoList | null => {
  const lists = getAllTodoLists();
  const listIndex = lists.findIndex(list => list.id === listId);
  
  if (listIndex === -1) return null;
  
  lists[listIndex].todos = lists[listIndex].todos.filter(todo => todo.id !== todoId);
  lists[listIndex].updatedAt = new Date();
  
  saveToStorage(TODO_LIST_STORAGE_KEY, lists);
  return lists[listIndex];
};

// Template Management
export const getAllTodoTemplates = (): TodoTemplate[] => {
  const templates = getFromStorage<TodoTemplate>(TODO_TEMPLATE_STORAGE_KEY);
  
  // If no templates exist, create default ones
  if (templates.length === 0) {
    const defaultTemplates = createDefaultTemplates();
    saveToStorage(TODO_TEMPLATE_STORAGE_KEY, defaultTemplates);
    return defaultTemplates;
  }
  
  return templates;
};

export const getTodoTemplate = (id: string): TodoTemplate | null => {
  const templates = getAllTodoTemplates();
  return templates.find(template => template.id === id) || null;
};

export const createTodoTemplate = (
  name: string,
  description: string,
  todos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[]
): TodoTemplate => {
  const newTemplate: TodoTemplate = {
    id: uuidv4(),
    name,
    description,
    todos
  };
  
  const templates = getAllTodoTemplates();
  templates.push(newTemplate);
  saveToStorage(TODO_TEMPLATE_STORAGE_KEY, templates);
  
  return newTemplate;
};

export const updateTodoTemplate = (
  id: string,
  updates: Partial<Omit<TodoTemplate, 'id'>>
): TodoTemplate | null => {
  const templates = getAllTodoTemplates();
  const templateIndex = templates.findIndex(template => template.id === id);
  
  if (templateIndex === -1) return null;
  
  const updatedTemplate = {
    ...templates[templateIndex],
    ...updates
  };
  
  templates[templateIndex] = updatedTemplate;
  saveToStorage(TODO_TEMPLATE_STORAGE_KEY, templates);
  
  return updatedTemplate;
};

export const deleteTodoTemplate = (id: string): boolean => {
  const templates = getAllTodoTemplates();
  const filteredTemplates = templates.filter(template => template.id !== id);
  
  if (filteredTemplates.length === templates.length) return false;
  
  saveToStorage(TODO_TEMPLATE_STORAGE_KEY, filteredTemplates);
  return true;
};

export const createTodoListFromTemplate = (
  templateId: string,
  title?: string
): TodoList | null => {
  const template = getTodoTemplate(templateId);
  if (!template) return null;
  
  return createTodoList(
    title || template.name,
    template.description,
    template.todos
  );
};

// Default templates
const createDefaultTemplates = (): TodoTemplate[] => {
  return [
    {
      id: uuidv4(),
      name: 'Project Plan',
      description: 'A template for planning and tracking project tasks',
      todos: [
        {
          title: 'Define project scope',
          description: 'Clearly outline what is included and excluded from the project',
          status: TodoStatus.NEW,
        },
        {
          title: 'Create timeline',
          description: 'Establish deadlines and milestones',
          status: TodoStatus.NEW,
        },
        {
          title: 'Assign responsibilities',
          description: 'Determine who will handle each aspect of the project',
          status: TodoStatus.NEW,
        },
        {
          title: 'Set up regular check-ins',
          description: 'Schedule recurring meetings to track progress',
          status: TodoStatus.NEW,
        },
        {
          title: 'Create documentation plan',
          description: 'Outline how project will be documented',
          status: TodoStatus.NEW,
        }
      ]
    },
    {
      id: uuidv4(),
      name: 'Weekly Planning',
      description: 'Organize your week effectively',
      todos: [
        {
          title: 'Review previous week',
          description: 'Evaluate what was completed and what needs to be carried over',
          status: TodoStatus.NEW,
        },
        {
          title: 'Set weekly goals',
          description: 'Identify 3-5 key objectives for the week',
          status: TodoStatus.NEW,
        },
        {
          title: 'Schedule important tasks',
          description: 'Block time on calendar for high-priority items',
          status: TodoStatus.NEW,
        },
        {
          title: 'Plan meetings',
          description: 'Prepare agendas for upcoming meetings',
          status: TodoStatus.NEW,
        }
      ]
    },
    {
      id: uuidv4(),
      name: 'Event Planning',
      description: 'Comprehensive checklist for organizing events',
      todos: [
        {
          title: 'Set event date and time',
          status: TodoStatus.NEW,
        },
        {
          title: 'Create guest list',
          status: TodoStatus.NEW,
        },
        {
          title: 'Book venue',
          status: TodoStatus.NEW,
        },
        {
          title: 'Arrange catering',
          status: TodoStatus.NEW,
        },
        {
          title: 'Send invitations',
          status: TodoStatus.NEW,
        },
        {
          title: 'Organize speakers/entertainment',
          status: TodoStatus.NEW,
        },
        {
          title: 'Prepare promotional materials',
          status: TodoStatus.NEW,
        }
      ]
    }
  ];
}; 