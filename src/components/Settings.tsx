import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/types';
import { X, Eye, EyeOff, ExternalLink, Plus, Trash2, RotateCcw } from 'lucide-react';
import { DEFAULT_MODEL, MODEL_OPTIONS, type ModelOption } from '../config/models';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { state, setApiKey, setModels } = useAppContext();
  const [key, setKey] = useState(state.apiKey || '');
  const [save, setSave] = useState(state.saveApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [models, setModelsState] = useState<ModelOption[]>(state.models.length ? state.models : MODEL_OPTIONS);
  const [modelErrors, setModelErrors] = useState<string | null>(null);

  useEffect(() => {
    const apiChanged = key !== (state.apiKey || '') || save !== state.saveApiKey;
    const modelsChanged = JSON.stringify(models) !== JSON.stringify(state.models);
    setIsChanged(apiChanged || modelsChanged);
  }, [key, save, state.apiKey, state.saveApiKey, models, state.models]);

  const handleSave = () => {
    if (!models.length) {
      setModelErrors('Add at least one model option.');
      return;
    }
    if (models.some((m) => !m.value.trim() || !m.label.trim())) {
      setModelErrors('Model value and label cannot be empty.');
      return;
    }
    setModelErrors(null);
    setModels(models);
    setApiKey(key.trim() || null, save);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  const addModelRow = () => {
    setModelsState((prev) => [...prev, { value: '', label: '' }]);
  };

  const updateModelRow = (index: number, updated: Partial<ModelOption>) => {
    setModelsState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updated } : item))
    );
  };

  const removeModelRow = (index: number) => {
    setModelsState((prev) => prev.filter((_, i) => i !== index));
  };

  const resetModels = () => {
    setModelsState(MODEL_OPTIONS);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 md:bg-black/20 md:backdrop-blur-sm md:flex md:items-center md:justify-center p-4">
      <div className="bg-white dark:bg-slate-800 md:rounded-xl shadow-2xl w-full h-full md:h-auto md:max-w-md flex flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your Google AI API key..."
                className="w-full p-3 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-400"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <ExternalLink size={12} />
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
              >
                Get your API key from Google AI Studio
              </a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                id="saveApiKey"
                type="checkbox"
                checked={save}
                onChange={(e) => setSave(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700"
              />
              <div>
                <label htmlFor="saveApiKey" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Save API key in browser
                </label>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                  {save
                    ? 'Your API key will be stored locally and automatically loaded on future visits.'
                    : 'Your API key will only be kept in memory during this session.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-50">Models</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">Configure model dropdown options</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetModels}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                  title="Reset to defaults"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={addModelRow}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {models.map((model, index) => (
                <div
                  key={`${model.value}-${index}`}
                  className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg p-3"
                >
                  <div className="col-span-5">
                    <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={model.value}
                      onChange={(e) => updateModelRow(index, { value: e.target.value })}
                      placeholder="gemini-2.5-flash"
                      className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
                    />
                  </div>
                  <div className="col-span-6">
                    <label className="block text-xs text-gray-600 dark:text-slate-400 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={model.label}
                      onChange={(e) => updateModelRow(index, { label: e.target.value })}
                      placeholder="Gemini 2.5 Flash"
                      className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeModelRow(index)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                      disabled={models.length === 1}
                      title="Remove model"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {modelErrors && (
                <p className="text-xs text-red-600 dark:text-red-400">{modelErrors}</p>
              )}
              {!models.length && (
                <p className="text-xs text-gray-600 dark:text-slate-400">No models configured.</p>
              )}
            </div>

            <div className="text-xs text-gray-600 dark:text-slate-400">
              Default model for new mini-apps: <span className="font-medium text-gray-900 dark:text-slate-100">{models[0]?.label || DEFAULT_MODEL}</span>
            </div>
          </div>

          {!state.apiKey && (
            <div className="bg-indigo-50 dark:bg-slate-700/80 border border-indigo-200 dark:border-slate-600 rounded-lg p-4">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                You need to set up your API key to start using Promptlet. Your key is processed locally and never sent to our servers.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 md:p-6 mt-auto border-t border-gray-200 dark:border-slate-600">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
