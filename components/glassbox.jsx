'use client'

import { useState, useRef, useEffect } from 'react';

let topZIndex = 1000;

export function GlassBox({ 
    title, icon, iconW="w-5", iconH="h-5", headerColor, children, initialX=100, initialY=100, order = ''}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [zIndex, setZIndex] = useState(topZIndex);
    const dragOffset = useRef({ x: 0, y: 0 });
    const boxRef = useRef(null);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768); // Tailwind's md breakpoint
        };

        checkScreenSize(); // Initial check
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);


    const handleMouseDown = (e) => {
    if (isSmallScreen) return;
    topZIndex += 1;
    setZIndex(topZIndex);
    setIsDragging(true);
    dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
    };
    document.body.style.userSelect = 'none'; // prevent text selection
    };

    useEffect(() => {

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const box = boxRef.current;
        const boxWidth = box.offsetWidth;
        const boxHeight = box.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        newX = Math.max(0, Math.min(newX, windowWidth - boxWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - boxHeight));

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
    }, [isDragging]);

    return (
        <div 
        ref={boxRef}
        style={
            isSmallScreen
            ? { position: 'relative', width: '100%', zIndex }
            : { position: 'absolute', left: position.x, top: position.y, zIndex }
        }
        className={`rounded-lg bg-gradient-to-b from-white/20 to-white/5 overflow-hidden shadow-2xl backdrop-blur-md bg-white/10 ${
            isSmallScreen ? `w-full m-2 ${order}` : 'w-fit'
        }`}
        >
            <div className={`flex glass-header px-3 py-2 bg-linear-65 ${headerColor ? headerColor : "from-black"} to-white/5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} onMouseDown={handleMouseDown}>
                {(icon != null) && (<img src={icon} alt='The icon of the window' className={`mr-1 ${iconW} ${iconH} select-none pointer-events-none`}></img>)}
                <h3 className="text-sm font-semibold text-white">{title}</h3>
            </div>
            <div className="px-6 py-4 bg-white/20 text-black">
                {children}
            </div>
        </div>
    );
}