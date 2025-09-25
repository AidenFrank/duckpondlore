'use client';

import { useEffect, useState } from 'react';
import { GlassBox } from './glassbox';
import { allBoxes } from '../boxes/registry.jsx';

export default function GlassBoxManager({ boxIds }) {
  const [boxConfigs, setBoxConfigs] = useState([]);

  useEffect(() => {
    const loadBoxes = async () => {
      const loaders = boxIds
        .map(id => allBoxes[id])
        .filter(Boolean); // skip missing IDs

      const modules = await Promise.all(loaders.map(loader => loader()));
      const configs = modules.map(mod => mod.default);

      setBoxConfigs(configs);
    };

    loadBoxes();
  }, [boxIds]);

  return (
    <>
      {boxConfigs.map((box) => (
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
      ))}
    </>
  );
}