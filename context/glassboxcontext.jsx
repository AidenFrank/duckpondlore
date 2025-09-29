// context/glassboxcontext.jsx
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

// counter lives outside the provider so IDs are unique across renders
let instanceCounter = 0;

export function GlassBoxProvider({ children, initialBoxInstances = [] }) {
    // Normalizer: ensure every instance has:
    //  - id (unique runtime id)
    //  - sourceId (canonical DB id)
    //  - overrides (object)
    const normalizeInstance = (inst) => {
        const sourceId = inst.sourceId ?? inst.type ?? inst.id ?? null;
        const id = inst.id ?? `${sourceId ?? 'box'}-${Date.now()}-${instanceCounter++}`;
        const overrides = inst.overrides ?? {};
        return {
            ...inst,
            id,
            sourceId,
            overrides
        };
    };

    const [boxes, setBoxes] = useState({});
    // Normalize initial instances once at startup
    const [boxInstances, setBoxInstances] = useState(() =>
        Array.isArray(initialBoxInstances) ? initialBoxInstances.map(normalizeInstance) : []
    );

    const registerBox = (id, initialState = {}) => {
        setBoxes((prev) => {
            const existing = prev[id] || {};

            // Extract style keys into a style object
            const style = { ...(existing.style || {}) };
            const rest = { ...existing };

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
                    ...rest,
                    visible: existing.visible ?? true,
                    hasRenderedOnce: initialState.hasRenderedOnce ?? existing.hasRenderedOnce ?? false,
                    zIndex: existing.zIndex ?? 1000,
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

    // spawnBox supports either:
    //  - spawnBox(sourceId, overrides)
    //  - spawnBox({ sourceId, overrides, id, ... })
    // This will normalize and push an instance (with unique id) into boxInstances.
    const spawnBox = (arg1, arg2) => {
        let boxConfig;
        if (typeof arg1 === 'string') {
            boxConfig = { sourceId: arg1, overrides: arg2 || {} };
        } else {
            boxConfig = arg1 || {};
        }

        const inst = normalizeInstance(boxConfig);
        setBoxInstances((prev) => [...prev, inst]);

        return inst.id;
    };

    // Convenience wrapper: openBox(sourceId, overrides)
    const openBox = (sourceId, overrides = {}) => {
        return spawnBox(sourceId, overrides);
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
                visible: !prev[id]?.visible
            }
        }));
    };

    return (
        <GlassBoxContext.Provider
            value={{ boxes, registerBox, updateBox, boxInstances, spawnBox, openBox, toggleVisibility, closeBox }}
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
