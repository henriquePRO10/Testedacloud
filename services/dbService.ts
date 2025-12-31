
import { Task, Category } from '../types';

/**
 * CLOUDFLARE D1 DATABASE SERVICE
 * 
 * Este serviço faz requisições para Workers Functions que acessam o D1.
 * 
 * Endpoints:
 * - GET /api/categories - Lista categorias
 * - POST /api/categories - Cria/atualiza categoria
 * - DELETE /api/categories?id=xxx - Remove categoria
 * - GET /api/tasks - Lista tarefas
 * - POST /api/tasks - Cria/atualiza tarefa
 * - DELETE /api/tasks?id=xxx - Remove tarefa
 */

// Detecta se está em desenvolvimento ou produção
const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8788' // Wrangler dev local
  : ''; // Em produção, usa o mesmo domínio (Pages Functions)

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Trabalho', color: '#3b82f6' },
  { id: 'cat-2', name: 'Pessoal', color: '#10b981' },
  { id: 'cat-3', name: 'Estudos', color: '#f59e0b' }
];

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const dbService = {
  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    try {
      const categories = await fetchAPI('/api/categories');
      // Se não houver categorias, retorna as padrão (serão inseridas no primeiro POST)
      return categories.length > 0 ? categories : defaultCategories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para localStorage em caso de erro
      const data = localStorage.getItem('taskflow_categories_backup');
      return data ? JSON.parse(data) : defaultCategories;
    }
  },

  async saveCategory(category: Category): Promise<void> {
    try {
      await fetchAPI('/api/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      // Backup local
      const categories = await this.getCategories();
      localStorage.setItem('taskflow_categories_backup', JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await fetchAPI(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  },

  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await fetchAPI('/api/tasks');
      return tasks || [];
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      // Fallback para localStorage
      const data = localStorage.getItem('taskflow_tasks_backup');
      return data ? JSON.parse(data) : [];
    }
  },

  async saveTask(task: Task): Promise<void> {
    try {
      await fetchAPI('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
      // Backup local
      const tasks = await this.getTasks();
      localStorage.setItem('taskflow_tasks_backup', JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await fetchAPI(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }
};
