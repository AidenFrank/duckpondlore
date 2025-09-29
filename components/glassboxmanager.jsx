// components/glassboxmanager.jsx
'use client';

import { useEffect, useState } from 'react';
import { GlassBox } from './glassbox';
import { loadBoxes } from '../boxes/registry.jsx';
import { useGlassBox } from '../context/glassboxcontext';

export default function GlassBoxManager() {
    const { boxes, registerBox, boxInstances } = useGlassBox();
    const [boxConfigs, setBoxConfigs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAndMerge = async () => {
            try {
                const registry = await loadBoxes();

                const merged = await Promise.all(
                    boxInstances.map(async (inst) => {
                        const sourceKey = inst.sourceId ?? inst.type ?? inst.id;
                        const loader = registry[sourceKey];

                        if (!loader) {
                            console.warn(
                                `[GlassBoxManager] No loader found for "${sourceKey}" (instance: "${inst.id}")`
                            );
                            return inst;
                        }

                        try {
                            const cfg = await loader(); // canonical config
                            const overrides = inst.overrides || {};
                            const mergedConfig = {
                                ...cfg,
                                ...overrides,
                                ...inst, // includes id (instance id) and sourceId
                                sourceId: cfg.id ?? inst.sourceId
                            };

                            return mergedConfig;
                        } catch (err) {
                            console.error(`[GlassBoxManager] Error loading config for ${sourceKey}:`, err);
                            return inst;
                        }
                    })
                );

                merged.forEach((config) => registerBox(config.id, config));

                setBoxConfigs(merged);
                setError(null);
            } catch (err) {
                console.error('[GlassBoxManager] Failed to load registry:', err);
                setError(err.message || 'Unknown error');
            }
        };

        loadAndMerge();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boxInstances]);

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-100 border border-red-300 rounded">
                <strong>Error loading boxes:</strong> {error}
            </div>
        );
    }

    return (
        <>
            {boxConfigs.map((box) => {
                if (!boxes[box.id]) return null;

                const contentElement = box.Template ? (
                    <box.Template {...box} />
                ) : box.Wrapper ? (
                    <box.Wrapper>{box.content}</box.Wrapper>
                ) : (
                    box.content
                );

                return (
                    <GlassBox
                        key={box.id}
                        id={box.id}
                        title={box.title}
                        icon={box.icon}
                        iconW={box.iconW}
                        iconH={box.iconH}
                        headerColor={box.headerColor}
                        initialX={box.initialX}
                        initialY={box.initialY}
                        sizeClasses={box.sizeClasses}
                        order={box.order}
                        contentClassName={box.contentClassName}
                        disableDefaultWrapper={box.disableDefaultWrapper}
                    >
                        {contentElement}
                    </GlassBox>
                );
            })}
        </>
    );
}
