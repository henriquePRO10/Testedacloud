
import { Task, Category } from '../types';

/**
 * CLOUDFLARE D1 SCHEMA (SQL):
 * 
 * CREATE TABLE categories (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   color TEXT NOT NULL
 * );
 * 
 * CREATE TABLE tasks (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   content TEXT,
 *   categoryId TEXT,
 *   deadline TEXT,
 *   createdAt TEXT,
 *   FOREIGN KEY(categoryId) REFERENCES categories(id)
 * );
 */

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  CATEGORIES: 'taskflow_categories'
};

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Trabalho', color: '#3b82f6' },
  { id: 'cat-2', name: 'Pessoal', color: '#10b981' },
  { id: 'cat-3', name: 'Estudos', color: '#f59e0b' }
];

export const dbService = {
  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return JSON.parse(data);
  },

  async saveCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index > -1) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  async deleteCategory(id: string): Promise<void> {
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  },

  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  }
};
