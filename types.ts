
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  deadline: string;
  createdAt: string;
}

export type AppTab = 'tasks' | 'settings';
