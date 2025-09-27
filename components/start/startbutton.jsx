'use client';

export default function StartButton({ toggleMenu }) {
    return (
        <button
            title="Start"
            data-start-button
            className="h-full aspect-square flex items-center justify-center bg-transparent border-none outline-none"
            onClick={toggleMenu}
        >
            <div className="h-[80%] w-[80%] rounded-full overflow-hidden bg-white/20 transition duration-200 backdrop-blur-md hover:bg-white/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                <img
                    src="/images/The_Duckpond.png"
                    alt="Start"
                    className="h-full w-full object-cover transition duration-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                />
            </div>
        </button>
    );
}
