-- TaskFlow Pro - Cloudflare D1 Schema
-- Execute este script com: wrangler d1 execute taskflow-db --file=schema.sql

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  categoryId TEXT,
  deadline TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Inserir categorias padrão
INSERT OR IGNORE INTO categories (id, name, color) VALUES 
  ('cat-1', 'Trabalho', '#3b82f6'),
  ('cat-2', 'Pessoal', '#10b981'),
  ('cat-3', 'Estudos', '#f59e0b');

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(categoryId);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(createdAt);
