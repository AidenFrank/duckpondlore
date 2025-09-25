'use client';

import { createContext, useContext, useState } from 'react';

const DesktopIconContext = createContext();

export function DesktopIconProvider({ children }) {
  const [icons, setIcons] = useState({});

  const registerIcon = (id, initialState) => {
    setIcons(prev => ({
      ...prev,
      [id]: {
        ...initialState,
        visible: true,
      },
    }));
  };

  const updateIcon = (id, updates) => {
    setIcons(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  };

  return (
    <DesktopIconContext.Provider value={{ icons, registerIcon, updateIcon }}>
      {children}
    </DesktopIconContext.Provider>
  );
}

export const useDesktopIcon = () => useContext(DesktopIconContext);