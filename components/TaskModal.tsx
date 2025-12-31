
import React, { useState } from 'react';
import { Task, Category } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  categories: Category[];
  initialTask?: Task;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, categories, initialTask }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [content, setContent] = useState(initialTask?.content || '');
  const [categoryId, setCategoryId] = useState(initialTask?.categoryId || categories[0]?.id || '');
  const [deadline, setDeadline] = useState(initialTask?.deadline || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onSave({
      id: initialTask?.id || `task-${Date.now()}`,
      title,
      content,
      categoryId,
      deadline,
      createdAt: initialTask?.createdAt || new Date().toISOString()
    });
    onClose();
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl bg-[#333333] text-white border border-slate-600 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-1.5 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp border border-white/20">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-[#1a1c23] tracking-tight">{initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-2 text-2xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className={labelClasses}>Título</label>
            <input
              autoFocus
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={inputClasses}
              placeholder="O que precisa ser feito?"
            />
          </div>

          <div>
            <label className={labelClasses}>Conteúdo / Detalhes</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              className={`${inputClasses} resize-none`}
              placeholder="Descreva a tarefa..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Categoria</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-800 border-2 border-slate-100 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all font-medium cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Prazo</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-bold transform active:scale-[0.98]"
            >
              Salvar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
