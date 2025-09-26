'use client';

import { useEffect, useState } from 'react';
import DesktopIcon from './desktopicon';
import { allIcons } from '../../desktopicons/registry';

export default function DesktopIconManager({ iconIds }) {
    const [iconConfigs, setIconConfigs] = useState([]);

    useEffect(() => {
        const loadIcons = async () => {
            const loaders = iconIds.map((id) => allIcons[id]).filter(Boolean);

            const modules = await Promise.all(loaders.map((loader) => loader()));
            const configs = modules.map((mod) => mod.default);

            setIconConfigs(configs);
        };

        loadIcons();
    }, [iconIds]);

    return (
        <div className="flex flex-wrap items-start gap-2 p-4">
            {iconConfigs.map((icon) => (
                <DesktopIcon
                    key={icon.id}
                    title={icon.title}
                    icon={icon.icon}
                    link={icon.link}
                    iconW={icon.iconW}
                    iconH={icon.iconH}
                    initialX={icon.initialX}
                    initialY={icon.initialY}
                    isFlexLayout={true}
                />
            ))}
        </div>
    );
}
