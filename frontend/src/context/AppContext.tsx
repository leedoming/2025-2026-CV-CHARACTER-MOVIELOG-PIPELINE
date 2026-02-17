'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CharacterData {
  name: string;
  description: string;
  image: File | null;
  imageUrl: string;
}

interface Scene {
  id: number;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  duration?: string;
}

interface AppContextType {
  characterData: CharacterData;
  setCharacterData: (data: CharacterData) => void;
  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
  finalVideoUrl: string;
  setFinalVideoUrl: (url: string) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    description: '',
    image: null,
    imageUrl: '',
  });
  
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>('');

  const resetAll = () => {
    setCharacterData({
      name: '',
      description: '',
      image: null,
      imageUrl: '',
    });
    setScenes([]);
    setFinalVideoUrl('');
  };

  return (
    <AppContext.Provider value={{
      characterData,
      setCharacterData,
      scenes,
      setScenes,
      finalVideoUrl,
      setFinalVideoUrl,
      resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}