'use client';

import { useState, useRef, useEffect } from 'react';
import { useGlassBox } from '../context/glassboxcontext';

let topZIndex = 1000;

export function GlassBox({
    id,
    title,
    icon,
    iconW = 'w-5',
    iconH = 'h-5',
    headerColor,
    children,
    initialX = 100,
    initialY = 100,
    sizeClasses,
    order = ''
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [zIndex, setZIndex] = useState(topZIndex);
    const [hasMounted, setHasMounted] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const { boxes, toggleVisibility, updateBox } = useGlassBox();
    const boxState = boxes[id];
    const dragOffset = useRef({ x: 0, y: 0 });
    const boxRef = useRef(null);
    const prevVisibleRef = useRef(boxState.visible);
    const [visibilityAnimation, setVisibilityAnimation] = useState('');

    if (!boxState) return null;

    const { visible } = boxState;

    useEffect(() => {
        const delay = Math.random() * 1000 + 1000;
        const timer = setTimeout(() => {
            setHasMounted(true);

            // Disable animation after it plays
            setTimeout(() => {
                setShouldAnimate(false);
                updateBox(id, { hasRenderedOnce: true });
            }, 500); // match animation duration
        }, delay);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (boxState.hasRenderedOnce) {
            if (boxState.visible && !prevVisibleRef.current) {
                setVisibilityAnimation('fade-in');
            } else if (!boxState.visible && prevVisibleRef.current) {
                setVisibilityAnimation('fade-out');
            }
        }
        prevVisibleRef.current = boxState.visible;
    }, [boxState.visible, boxState.hasRenderedOnce]);

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

    const increaseZIndex = (e) => {
        topZIndex += 1;
        setZIndex(topZIndex);
    };

    const handleMouseDown = (e) => {
        if (isSmallScreen) return;
        if (!hasMounted) return;
        increaseZIndex();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
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

            // Ensure the box stays fully within the viewport
            const maxX = windowWidth - boxWidth;
            const maxY = windowHeight - boxHeight;

            newX = Math.min(Math.max(0, newX), maxX);
            newY = Math.min(Math.max(0, newY), maxY);

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

    useEffect(() => {
        const repositionIfViewportShrinks = () => {
            const box = boxRef.current;
            if (!box) return;

            const boxWidth = box.offsetWidth;
            const boxHeight = box.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let newX = position.x;
            let newY = position.y;

            // If the box would overflow the right or bottom edge, push it left/up
            if (newX + boxWidth > windowWidth) {
                newX = Math.max(0, windowWidth - boxWidth);
            }
            if (newY + boxHeight > windowHeight) {
                newY = Math.max(0, windowHeight - boxHeight);
            }

            // If the box is off the left or top edge, push it back in
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;

            // Only update if position changed
            if (newX !== position.x || newY !== position.y) {
                setPosition({ x: newX, y: newY });
            }
        };

        // Run on mount and on resize
        repositionIfViewportShrinks();
        window.addEventListener('resize', repositionIfViewportShrinks);
        return () => window.removeEventListener('resize', repositionIfViewportShrinks);
    }, [position]);

    return (
        <>
            {hasMounted && (!isSmallScreen || boxState.visible) && (
                <div
                    ref={boxRef}
                    style={
                        isSmallScreen
                            ? {
                                  position: 'relative',
                                  width: '97.5%',
                                  zIndex
                              }
                            : {
                                  position: 'absolute',
                                  left: position.x,
                                  top: position.y,
                                  zIndex,
                                  pointerEvents: boxState.visible ? 'auto' : 'none'
                              }
                    }
                    className={`rounded-lg bg-gradient-to-b from-white/20 to-white/5 overflow-hidden shadow-2xl backdrop-blur-md bg-white/10
            transform transition duration-500 ease-out ${shouldAnimate ? 'animate-pop' : !isSmallScreen ? visibilityAnimation : ''}
            ${isSmallScreen ? `w-fit m-2 ${order}` : ''}`}
                >
                    <div
                        className={`flex glass-header px-3 py-2 bg-linear-65 ${headerColor ? headerColor : 'from-black'} to-white/5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onMouseDown={handleMouseDown}
                    >
                        {icon != null && (
                            <img
                                src={icon}
                                alt="The icon of the window"
                                className={`mr-1 ${iconW} ${iconH} select-none pointer-events-none`}
                            ></img>
                        )}
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                    </div>
                    <div
                        className={`px-6 py-4 bg-white/20 text-black ${isSmallScreen ? '' : `${sizeClasses}`}`}
                        onMouseDown={increaseZIndex}
                    >
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
