import React, { createContext } from 'react';
import { type ModelOption } from '../config/models';

export interface MiniApp {
  id: string;
  name: string;
  systemPrompt?: string;
  model: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppState {
  apiKey: string | null;
  saveApiKey: boolean;
  miniApps: MiniApp[];
  activeMiniAppId: string | null;
  theme: ThemeMode;
  models: ModelOption[];
}

export interface AppContextProps {
  state: AppState;
  setApiKey: (apiKey: string | null, save?: boolean) => void;
  addMiniApp: (miniApp: Omit<MiniApp, 'id'>) => string;
  updateMiniApp: (miniApp: MiniApp) => void;
  deleteMiniApp: (id: string) => void;
  setActiveMiniAppId: (id: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setModels: (models: ModelOption[]) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
