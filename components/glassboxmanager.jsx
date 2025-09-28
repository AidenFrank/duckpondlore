'use client';

import { useEffect, useState } from 'react';
import { GlassBox } from './glassbox';
import { allBoxes } from '../boxes/registry.jsx';
import { useGlassBox } from '../context/glassboxcontext';

export default function GlassBoxManager({}) {
    const { boxes, registerBox, boxInstances } = useGlassBox();
    const [boxConfigs, setBoxConfigs] = useState([]);

    useEffect(() => {
        const loadBoxes = async () => {
            // preserve order: if a type is missing in registry, keep null to avoid shifting
            const loaders = boxInstances.map((inst) => allBoxes[inst.type] || null);
            const modules = await Promise.all(loaders.map((loader) => (loader ? loader() : Promise.resolve(null))));
            const templates = modules.map((mod) => (mod ? mod.default : {}));

            // Merge template -> instance (instance overrides template)
            const mergedConfigs = boxInstances.map((inst, i) => ({
                ...(templates[i] || {}),
                ...inst // instance overrides
            }));

            // Register each box config (context will extract style keys)
            mergedConfigs.forEach((config) => registerBox(config.id, config));
            setBoxConfigs(mergedConfigs);
        };

        loadBoxes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boxInstances]);

    return (
        <>
            {boxConfigs.map((box) => {
                if (!boxes[box.id]) return null; // guard: skip deleted/unregistered boxes

                // If the template provides a Wrapper component, wrap the content with it.
                const contentElement = box.Wrapper ? <box.Wrapper>{box.content}</box.Wrapper> : box.content;

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
