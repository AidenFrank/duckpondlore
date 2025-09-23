'use client'

import { useState, useRef, useEffect } from 'react';

export function GlassBox({ title, children, initialX = 100, initialY = 100 }) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const boxRef = useRef(null);


    const handleMouseDown = (e) => {
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
        style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            zIndex: 1000,
        }}
        className="max-w-2xl mx-auto rounded-lg bg-gradient-to-b from-white/20 to-white/5 overflow-hidden shadow-2xl backdrop-blur-md bg-white/10 border border-white/30"
        >
            <div className="glass-header px-3 py-2 cursor-move"
            onMouseDown={handleMouseDown}
        >
                <h3 className="text-sm font-semibold text-white">{title}</h3>
            </div>
            <div className="px-6 py-4 bg-white/20 text-white">
                {children}
            </div>
        </div>
    );
}