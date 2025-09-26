'use client';

import { useEffect, useState } from 'react';
import { GlassBox } from './glassbox';
import { allBoxes } from '../boxes/registry.jsx';
import { useGlassBox } from '../context/glassboxcontext';

export default function GlassBoxManager({ boxInstances }) {
    const [boxConfigs, setBoxConfigs] = useState([]);
    const { boxes, registerBox } = useGlassBox();

    useEffect(() => {
        const loadBoxes = async () => {
            const loaders = boxInstances.map((inst) => allBoxes[inst.type]).filter(Boolean);
            const modules = await Promise.all(loaders.map((loader) => loader()));
            const templates = modules.map((mod) => mod.default);

            const mergedConfigs = boxInstances.map((inst, i) => ({
                ...templates[i],
                ...inst // override with instance-specific values
            }));

            mergedConfigs.forEach((config) => registerBox(config.id, config));
            setBoxConfigs(mergedConfigs);
        };

        loadBoxes();
    }, [boxInstances]);

    return (
        <>
            {boxConfigs.map(
                (box) =>
                    boxes[box.id]?.visible && (
                        <GlassBox
                            key={box.id}
                            title={box.title}
                            icon={box.icon}
                            iconW={box.iconW}
                            iconH={box.iconH}
                            headerColor={box.headerColor}
                            initialX={box.initialX}
                            initialY={box.initialY}
                            sizeClasses={box.sizeClasses}
                            order={box.order}
                        >
                            {box.content}
                        </GlassBox>
                    )
            )}
        </>
    );
}
