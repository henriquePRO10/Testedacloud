
import React, { useState, useEffect, useCallback } from 'react';
import { Task, Category, AppTab } from './types';
import { dbService } from './services/dbService';
import { ListIcon, SettingsIcon, PlusIcon } from './components/Icons';
import { TaskBoard } from './components/TaskBoard';
import { CategoryManager } from './components/CategoryManager';
import { TaskModal } from './components/TaskModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [t, c] = await Promise.all([
      dbService.getTasks(),
      dbService.getCategories()
    ]);
    setTasks(t);
    setCategories(c);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveTask = async (task: Task) => {
    await dbService.saveTask(task);
    fetchData();
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await dbService.deleteTask(id);
      fetchData();
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    await dbService.saveCategory(cat);
    fetchData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (tasks.some(t => t.categoryId === id)) {
      alert('Não é possível excluir uma categoria que possui tarefas vinculadas.');
      return;
    }
    await dbService.deleteCategory(id);
    fetchData();
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              TaskFlow Pro
            </h1>
          </div>

          <nav className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ListIcon />
              Tarefas
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <SettingsIcon />
              Categorias
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'tasks' ? (
              <section>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Suas Tarefas</h2>
                    <p className="text-slate-500">Você tem {tasks.length} tarefas registradas.</p>
                  </div>
                  <button
                    onClick={openNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                  >
                    <PlusIcon />
                    Nova Tarefa
                  </button>
                </div>
                <TaskBoard
                  tasks={tasks}
                  categories={categories}
                  onDelete={handleDeleteTask}
                  onEdit={openEdit}
                />
              </section>
            ) : (
              <section>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Parametrização</h2>
                  <p className="text-slate-500">Gerencie as categorias e cores para organizar seus cards.</p>
                </div>
                <CategoryManager
                  categories={categories}
                  onSave={handleSaveCategory}
                  onDelete={handleDeleteCategory}
                />
              </section>
            )}
          </>
        )}
      </main>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          categories={categories}
          initialTask={editingTask}
        />
      )}

      {/* Floating Action Button (Mobile only) */}
      <button
        onClick={openNew}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <PlusIcon />
      </button>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default App;
