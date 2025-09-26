'use client';

import { useGlassBox } from 'context/glassboxcontext';
import StartButton from 'components/startbutton/startbutton';

export default function Footer() {
    const { boxes, boxInstances, toggleVisibility } = useGlassBox();

    return (
        <footer className="fixed bottom-0 left-0 w-full h-16 z-[9999] glass-taskbar flex items-center px-4">
            {/* Start Button Area */}
            <div className="flex items-center">
                <div className="h-15 w-15">
                    <StartButton />
                </div>
            </div>

            {/* Footer Items Area */}
            <div className="flex items-center ml-4">
                {boxInstances.map(({ id }) => {
                    const box = boxes[id];
                    if (!box) return null;

                    const { title, icon, visible } = box;
                    const fallbackLetter = title?.charAt(0)?.toUpperCase() || '?';

                    return (
                        <button
                            key={id}
                            onClick={() => toggleVisibility(id)}
                            className={`w-[64px] h-16 flex items-center justify-center transition-all duration-300 relative ${
                                visible
                                    ? 'text-white bg-white/30 border-l border-r border-black/50 rounded-t-md rounded-b-md hover:bg-white/50'
                                    : 'text-gray-400 bg-transparent border-l border-r border-transparent hover:border-black/30'
                            }`}
                            title={title}
                        >
                            {icon ? (
                                <img src={icon} alt={title} className="w-10 h-10 object-contain" />
                            ) : (
                                <span className="text-2xl font-bold">{fallbackLetter}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </footer>
    );
}
