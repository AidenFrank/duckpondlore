// components/glassboxmanager.jsx
'use client';

import { useEffect, useState } from 'react';
import { GlassBox } from './glassbox';
import { loadBoxes } from '../boxes/registry.jsx';
import { useGlassBox } from '../context/glassboxcontext';
import { templates } from '../boxes/templates';

export default function GlassBoxManager() {
    const { boxes, registerBox, boxInstances } = useGlassBox();
    const [boxConfigs, setBoxConfigs] = useState([]);

    useEffect(() => {
        const loadAndMerge = async () => {
            const registry = await loadBoxes(); // fetches/constructs loaders from JSON
            // For each instance, call the proper registry loader (if one exists)
            const merged = await Promise.all(
                boxInstances.map(async (inst) => {
                    const loader = registry[inst.type];
                    if (!loader) {
                        // no registry entry found for this type -> just use the instance as-is
                        return inst;
                    }
                    try {
                        const cfg = await loader(); // cfg is the config object returned by the loader
                        // merge registry config -> instance overrides (instance overrides registry)
                        return {
                            ...cfg,
                            ...inst
                        };
                    } catch (err) {
                        console.error('Error loading box template/config for', inst.type, err);
                        return inst;
                    }
                })
            );

            // register each config (context will extract style keys)
            merged.forEach((config) => registerBox(config.id, config));
            setBoxConfigs(merged);
        };

        loadAndMerge();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boxInstances]);

    return (
        <>
            {boxConfigs.map((box) => {
                if (!boxes[box.id]) return null;

                // If it's template-driven, render the Template component with data props
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
