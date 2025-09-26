'use client';

import { useGlassBox } from 'context/glassboxcontext';

export default function StartButton() {
    const { spawnBox } = useGlassBox();

    const handleClick = () => {
        spawnBox('about', {
            title: 'New About baybeee',
            initialX: 500,
            initialY: 500
        });
    };

    return (
        <button
            title="Start"
            className="h-full aspect-square flex items-center justify-center bg-transparent border-none outline-none"
        >
            <div
                className="h-[80%] w-[80%] rounded-full overflow-hidden bg-white/20 transition duration-200 backdrop-blur-md hover:bg-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                onClick={handleClick}
            >
                <img
                    src="/images/The_Duckpond.png"
                    alt="Start"
                    className="h-full w-full object-cover transition duration-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                />
            </div>
        </button>
    );
}
