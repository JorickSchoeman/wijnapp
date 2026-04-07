import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WineEntry {
  id: string;
  name: string;
  winery: string;
  grape: string;
  region: string;
  store?: string;
  rating: number;
  date: string;
  sliders: {
    zoetheid: number;
    zuurgraad: number;
    tannine: number;
    body: number;
    fruitigheid: number;
    kruidigheid: number;
    houtigheid: number;
  };
  tags: string[];
  note: string;
}

interface WineContextType {
  wines: WineEntry[];
  addWine: (wine: Omit<WineEntry, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const WineContext = createContext<WineContextType | undefined>(undefined);

export const WineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wines, setWines] = useState<WineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('personal_wine_collection');
    if (saved) {
      try {
        setWines(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wine collection', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('personal_wine_collection', JSON.stringify(wines));
    }
  }, [wines, isLoading]);

  const addWine = (newWine: Omit<WineEntry, 'id' | 'date'>) => {
    const entry: WineEntry = {
      ...newWine,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }),
    };
    setWines(prev => [entry, ...prev]);
  };

  return (
    <WineContext.Provider value={{ wines, addWine, isLoading }}>
      {children}
    </WineContext.Provider>
  );
};

export const useWines = () => {
  const context = useContext(WineContext);
  if (!context) {
    throw new Error('useWines must be used within a WineProvider');
  }
  return context;
};
