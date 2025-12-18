import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../contexts/types';
import { type MiniApp } from '../contexts/types';
import { X, Check } from 'lucide-react';
import { DEFAULT_MODEL, MODEL_OPTIONS, type ModelOption } from '../config/models';

interface CreateAppModalProps {
  onClose: () => void;
  editingApp?: MiniApp | null;
}

const CreateAppModal: React.FC<CreateAppModalProps> = ({ onClose, editingApp }) => {
  const { addMiniApp, updateMiniApp, state } = useAppContext();
  const [formData, setFormData] = useState(() => ({
    name: '',
    model: state.models?.[0]?.value || DEFAULT_MODEL,
    systemPrompt: '',
  }));

  useEffect(() => {
    if (editingApp) {
      setFormData({
        name: editingApp.name,
        model: editingApp.model,
        systemPrompt: editingApp.systemPrompt || '',
      });
    }
  }, [editingApp]);

  const models: ModelOption[] = useMemo(() => {
    const base = state.models?.length ? state.models : MODEL_OPTIONS;
    if (!editingApp) return base;
    const exists = base.some((model) => model.value === editingApp.model);
    return exists
      ? base
      : [
          ...base,
          { value: editingApp.model, label: `${editingApp.model} (existing)` },
        ];
  }, [editingApp, state.models]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingApp) {
      updateMiniApp({
        ...editingApp,
        name: formData.name.trim(),
        model: formData.model,
        systemPrompt: formData.systemPrompt.trim() || ''
      });
    } else {
      addMiniApp({
        name: formData.name.trim(),
        model: formData.model,
        systemPrompt: formData.systemPrompt.trim() || ''
      });
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 md:bg-black/20 md:backdrop-blur-sm md:flex md:items-center md:justify-center p-4">
      <div className="bg-white dark:bg-slate-800 md:rounded-xl shadow-2xl w-full h-full md:h-auto md:max-w-lg flex flex-col">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-slate-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-50">
              {editingApp ? 'Edit Mini-App' : 'Create Mini-App'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-4 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter mini-app name..."
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                {models.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                System Prompt
              </label>
              <textarea
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Instructions for the AI model..."
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
                rows={8}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 md:p-6 border-t border-gray-200 dark:border-slate-600">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {editingApp ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppModal;
