'use client';

import { createContext, useContext, useState } from 'react';

const GlassBoxContext = createContext();

const STYLE_KEYS = [
    'headerColor',
    'sizeClasses',
    'icon',
    'iconW',
    'iconH',
    'initialX',
    'initialY',
    'order',
    'contentClassName',
    'disableDefaultWrapper',
    'Wrapper',
    'resizable'
];

export function GlassBoxProvider({ children, initialBoxInstances = [] }) {
    const [boxes, setBoxes] = useState({});
    const [boxInstances, setBoxInstances] = useState(initialBoxInstances);

    const registerBox = (id, initialState = {}) => {
        setBoxes((prev) => {
            if (prev[id]) return prev; // already registered

            // Extract style keys into a style object, keep the rest as runtime/config
            const style = {};
            const rest = {};

            for (const key of Object.keys(initialState)) {
                if (STYLE_KEYS.includes(key)) {
                    style[key] = initialState[key];
                } else {
                    rest[key] = initialState[key];
                }
            }

            return {
                ...prev,
                [id]: {
                    ...rest, // config/runtime fields (title, type, content, etc.)
                    visible: true,
                    hasRenderedOnce: initialState.hasRenderedOnce ?? false,
                    zIndex: 1000,
                    style
                }
            };
        });
    };

    const updateBox = (id, updates = {}) => {
        setBoxes((prev) => {
            if (!prev[id]) return prev;

            const newState = { ...prev[id] };
            const styleUpdates = {};
            const restUpdates = {};

            // Accept either { style: { ... } } or style keys at root, or runtime updates.
            if (updates.style && typeof updates.style === 'object') {
                Object.assign(styleUpdates, updates.style);
            }

            for (const key of Object.keys(updates)) {
                if (key === 'style') continue;
                if (STYLE_KEYS.includes(key)) {
                    styleUpdates[key] = updates[key];
                } else {
                    restUpdates[key] = updates[key];
                }
            }

            return {
                ...prev,
                [id]: {
                    ...newState,
                    ...restUpdates,
                    style: { ...(newState.style || {}), ...styleUpdates }
                }
            };
        });
    };

    const spawnBox = (type, overrides = {}) => {
        const id = overrides.id || `box-${Date.now()}`;
        const title =
            overrides.title || (typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : 'Box');

        const newInstance = { id, type, title, ...overrides };
        setBoxInstances((prev) => [...prev, newInstance]);

        // Register with style extraction handled by registerBox
        registerBox(id, {
            ...overrides,
            title,
            type,
            id
        });
    };

    const closeBox = (id) => {
        setBoxes((prev) => {
            const newBoxes = { ...prev };
            delete newBoxes[id];
            return newBoxes;
        });

        setBoxInstances((prev) => prev.filter((box) => box.id !== id));
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
        <GlassBoxContext.Provider
            value={{ boxes, registerBox, updateBox, boxInstances, spawnBox, toggleVisibility, closeBox }}
        >
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
