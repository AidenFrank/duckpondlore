'use client';

import { createContext, useContext, useState } from 'react';

const GlassBoxContext = createContext();

export function GlassBoxProvider({ children }) {
    const [boxes, setBoxes] = useState({});

    const registerBox = (id, initialState) => {
        setBoxes(prev => ({
            ...prev,
            [id]: {
                ...initialState,
                minimized: false,
                maximized: false,
                visible: true,
                zIndex: 1000,
            },
        }));
    };

    const updateBox = (id, updates) => {
        setBoxes(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates },
        }));
    };

    const toggleMinimize = (id) => {
        setBoxes(prev => ({
        ...prev,
        [id]: {
            ...prev[id],
            minimized: !prev[id].minimized,
            maximized: false,
        },
        }));
    };

    const toggleMaximize = (id) => {
        setBoxes(prev => ({
        ...prev,
        [id]: {
            ...prev[id],
            maximized: !prev[id].maximized,
            minimized: false,
        },
        }));
    };

    return (
        <GlassBoxContext.Provider value={{ boxes, registerBox, updateBox, toggleMinimize, toggleMaximize }}>
            {children}
        </GlassBoxContext.Provider>
    );
}

export const useGlassBox = () => useContext(GlassBoxContext);