'use client';

import { useEffect, useState } from 'react';
import { useGlassBox } from 'context/glassboxcontext';
import StartButton from 'components/start/startbutton';

export default function Footer() {
    const { boxes, boxInstances, toggleVisibility } = useGlassBox();
    const [orderedBoxes, setOrderedBoxes] = useState([]);
    const [draggedId, setDraggedId] = useState(null);

    const getFirstGrapheme = (str) => {
        return Array.from(str)[0] || '?';
    };
    useEffect(() => {
        setOrderedBoxes(boxInstances);
    }, [boxInstances]);

    return (
        <footer className="fixed bottom-0 left-0 w-full h-16 z-[9999] glass-taskbar flex items-center px-4">
            {/* Start Button Area */}
            <div className="flex items-center">
                <div className="h-15 w-15">
                    <StartButton />
                </div>
            </div>

            {/* Scrollable Footer Items Area */}
            <div className="ml-4 flex-1 overflow-x-auto h-full">
                <div className="flex min-w-max h-full">
                    {orderedBoxes.map(({ id }) => {
                        const box = boxes[id];

                        if (!box) return null;

                        const { title, icon, visible } = box;
                        const fallbackLetter = getFirstGrapheme(title);
                        const isEmoji = (char) => {
                            const code = char.codePointAt(0);
                            return code >= 0x1f300 && code <= 0x1faff;
                        };

                        const emoji = isEmoji(fallbackLetter);

                        return (
                            <button
                                key={id}
                                draggable
                                onDragStart={() => setDraggedId(id)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                    if (draggedId === null || draggedId === id) return;

                                    const newOrder = [...orderedBoxes];
                                    const fromIndex = newOrder.findIndex((b) => b.id === draggedId);
                                    const toIndex = newOrder.findIndex((b) => b.id === id);

                                    const [moved] = newOrder.splice(fromIndex, 1);
                                    newOrder.splice(toIndex, 0, moved);

                                    setOrderedBoxes(newOrder);
                                    setDraggedId(null);
                                }}
                                onClick={() => toggleVisibility(id)}
                                className={`w-[64px] h-full flex-shrink-0 flex items-center justify-center transition-all duration-300 relative ${
                                    visible
                                        ? 'text-white bg-white/30 border-l border-r border-black/50 rounded-t-md rounded-b-md hover:bg-white/50'
                                        : 'text-gray-400 bg-transparent border-l border-r border-transparent hover:border-black/30'
                                }`}
                                title={title}
                            >
                                {icon ? (
                                    <img
                                        src={icon}
                                        alt={title}
                                        className={`w-10 h-10 object-contain transition duration-200 ${
                                            visible ? '' : 'grayscale opacity-60'
                                        }`}
                                    />
                                ) : (
                                    <span
                                        className={`transition duration-200 font-bold ${
                                            visible ? 'text-white' : 'text-gray-400 filter grayscale opacity-60'
                                        } ${emoji ? 'text-3xl' : 'text-2xl'}`}
                                    >
                                        {fallbackLetter}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
}
