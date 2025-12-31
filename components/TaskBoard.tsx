
import React from 'react';
import { Task, Category } from '../types';
import { TrashIcon, CalendarIcon } from './Icons';

interface TaskBoardProps {
  tasks: Task[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, categories, onDelete, onEdit }) => {
  const getCategory = (id: string) => categories.find(c => c.id === id);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-300 mb-4">
          <CalendarIcon />
        </div>
        <h3 className="text-lg font-medium text-slate-500">Nenhuma tarefa encontrada</h3>
        <p className="text-slate-400">Comece criando uma nova tarefa clicando no botão abaixo.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {tasks.map(task => {
        const cat = getCategory(task.categoryId);
        const isOverdue = task.deadline && new Date(task.deadline) < new Date(new Date().toDateString());
        
        return (
          <div
            key={task.id}
            onClick={() => onEdit(task)}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <span 
                className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md"
                style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}
              >
                {cat?.name || 'Sem categoria'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <TrashIcon />
              </button>
            </div>

            <h4 className="text-lg font-semibold text-slate-800 mb-2 leading-tight">{task.title}</h4>
            <p className="text-slate-500 text-sm line-clamp-3 mb-4">{task.content || 'Sem descrição.'}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                <CalendarIcon />
                {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
              </div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
