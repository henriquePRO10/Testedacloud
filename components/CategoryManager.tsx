
import React, { useState } from 'react';
import { Category } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface CategoryManagerProps {
  categories: Category[];
  onSave: (cat: Category) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#1e293b', '#06b6d4'
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onSave, onDelete }) => {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onSave({
      id: `cat-${Date.now()}`,
      name: newName,
      color: newColor
    });
    setNewName('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-5 text-slate-800 ml-1">Criar Nova Categoria</h3>
        <div className="flex flex-col gap-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex: Trabalho, Urgente..."
            className="w-full px-5 py-3 rounded-xl bg-[#333333] text-white border border-slate-600 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400"
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 ${newColor === color ? 'border-white ring-2 ring-indigo-500 scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all font-bold shadow-md active:scale-95"
            >
              <PlusIcon />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm transition-hover hover:border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-lg shadow-sm" style={{ backgroundColor: cat.color }} />
              <span className="font-bold text-slate-800">{cat.name}</span>
            </div>
            <button
              onClick={() => onDelete(cat.id)}
              className="text-slate-400 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 transition-all"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
