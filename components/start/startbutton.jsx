// components/start/startbutton.jsx
'use client';

export default function StartButton({ toggleMenu, isActive }) {
    return (
        <button
            title="Start"
            data-start-button
            className="h-full aspect-square flex items-center justify-center bg-transparent border-none outline-none"
            onClick={toggleMenu}
        >
            <div
                className={`h-[80%] w-[80%] rounded-full overflow-hidden backdrop-blur-md transition duration-200
                    ${
                        isActive
                            ? 'bg-white/20 shadow-[0_0_16px_4px_rgba(255,255,255,0.7)]'
                            : 'bg-white/20 hover:bg-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    }`}
            >
                <img
                    src="/images/The_Duckpond.png"
                    alt="Start"
                    className="h-full w-full object-cover transition duration-200"
                />
            </div>
        </button>
    );
}
