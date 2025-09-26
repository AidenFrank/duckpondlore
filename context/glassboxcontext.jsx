'use client';

import { createContext, useContext, useState } from 'react';

const GlassBoxContext = createContext();

export function GlassBoxProvider({ children, initialBoxInstances = [] }) {
    const [boxes, setBoxes] = useState({});
    const [boxInstances, setBoxInstances] = useState(initialBoxInstances);

    const registerBox = (id, initialState) => {
        setBoxes((prev) => {
            if (prev[id]) return prev; // already registered
            return {
                ...prev,
                [id]: {
                    ...initialState,
                    visible: true,
                    hasRenderedOnce: false,
                    zIndex: 1000
                }
            };
        });
    };

    const updateBox = (id, updates) => {
        setBoxes((prev) => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
    };

    const spawnBox = (type, overrides = {}) => {
        const id = overrides.id || `box-${Date.now()}`;
        const title = overrides.title || type.charAt(0).toUpperCase() + type.slice(1);
        const newInstance = { id, type, title, ...overrides };
        setBoxInstances((prev) => [...prev, newInstance]);

        registerBox(id, { ...overrides.initialState, title });
    };

    const toggleVisibility = (id) => {
        setBoxes((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                visible: !prev[id].visible
            }
        }));
    };

    return (
        <GlassBoxContext.Provider value={{ boxes, registerBox, updateBox, boxInstances, spawnBox, toggleVisibility }}>
            {children}
        </GlassBoxContext.Provider>
    );
}

export const useGlassBox = () => {
    const context = useContext(GlassBoxContext);
    if (!context) {
        throw new Error('useGlassBox must be used within a GlassBoxProvider');
    }
    return context;
};
