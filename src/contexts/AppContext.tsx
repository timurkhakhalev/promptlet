import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type MiniApp, type ThemeMode, type AppState, AppContext } from './types';
import { DEFAULT_MODEL, MODEL_OPTIONS, type ModelOption } from '../config/models';

const getDefaultModel = (models: ModelOption[]) => (models?.[0]?.value ? models[0].value : DEFAULT_MODEL);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper function to apply theme
  const applyTheme = (theme: ThemeMode) => {
    const html = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldBeDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);

    if (shouldBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('promptletState');

    let initialState: AppState = {
      apiKey: null,
      saveApiKey: true,
      miniApps: [],
      activeMiniAppId: null,
      theme: 'light' as ThemeMode, // Default to light theme instead of system
      models: MODEL_OPTIONS,
    };

    if (savedState) {
      const parsed = JSON.parse(savedState);
      initialState = {
        ...initialState,
        ...parsed,
        models: parsed.models?.length ? parsed.models : MODEL_OPTIONS,
      };
    }

    return initialState;
  });

  // Apply theme immediately on state initialization
  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]); // Run only once on mount

  useEffect(() => {
    if (state.saveApiKey) {
      localStorage.setItem('promptletState', JSON.stringify(state));
    } else {
      const { ...stateWithoutApiKey } = state;
      // a bit of a hack to remove apiKey from the state that gets saved to localstorage
      delete (stateWithoutApiKey as Partial<AppState>).apiKey;
      localStorage.setItem('promptletState', JSON.stringify(stateWithoutApiKey));
    }
  }, [state]);

  useEffect(() => {
    applyTheme(state.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (state.theme === 'system') {
        applyTheme(state.theme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  const setApiKey = (apiKey: string | null, save: boolean = true) => {
    setState((prevState) => ({
      ...prevState,
      apiKey,
      saveApiKey: save
    }));
  };

  const setModels = (models: ModelOption[]) => {
    if (!models.length) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      models,
    }));
  };

  const addMiniApp = (miniApp: Omit<MiniApp, 'id'>) => {
    const newId = uuidv4();
    setState((prevState) => {
      const modelToUse = miniApp.model || getDefaultModel(prevState.models);
      const newMiniApp = {
        ...miniApp,
        model: modelToUse,
        id: newId
      };
      return {
        ...prevState,
        miniApps: [...prevState.miniApps, newMiniApp],
        activeMiniAppId: newMiniApp.id, // Auto-select the newly created app
      };
    });
    return newId;
  };

  const updateMiniApp = (updatedMiniApp: MiniApp) => {
    setState((prevState) => ({
      ...prevState,
      miniApps: prevState.miniApps.map((app) =>
        app.id === updatedMiniApp.id ? updatedMiniApp : app
      ),
    }));
  };

  const deleteMiniApp = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      miniApps: prevState.miniApps.filter((app) => app.id !== id),
    }));
  };

  const setActiveMiniAppId = (id: string | null) => {
    setState((prevState) => ({ ...prevState, activeMiniAppId: id }));
  };

  const setTheme = (theme: ThemeMode) => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setApiKey,
        addMiniApp,
        updateMiniApp,
        deleteMiniApp,
        setActiveMiniAppId,
        setTheme,
        setModels,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
