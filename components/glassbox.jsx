'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
    order = '',
    contentClassName = '',
    disableDefaultWrapper = false
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [zIndex, setZIndex] = useState(topZIndex);
    const [hasMounted, setHasMounted] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const { boxes, toggleVisibility, updateBox, closeBox } = useGlassBox();
    const dragOffset = useRef({ x: 0, y: 0 });
    const boxRef = useRef(null);
    const [visibilityAnimation, setVisibilityAnimation] = useState('');
    const boxState = boxes[id];
    const prevVisibleRef = useRef(false);
    const isMissing = !boxState;
    if (isMissing) return null;
    const { visible } = boxState;

    // Read style overrides from context (if present) so runtime updates work
    const style = boxState?.style || {};
    const appliedHeaderColor = style.headerColor || headerColor;
    const appliedSizeClasses = style.sizeClasses || sizeClasses;
    const appliedContentClassName = style.contentClassName || contentClassName;
    const appliedDisableDefaultWrapper =
        typeof style.disableDefaultWrapper !== 'undefined' ? style.disableDefaultWrapper : disableDefaultWrapper;
    const appliedIcon = style.icon || icon;
    const appliedIconW = style.iconW || iconW;
    const appliedIconH = style.iconH || iconH;
    const appliedOrder = style.order || order;

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
        if (id === 'help') {
            topZIndex += 1;
            setZIndex(topZIndex);
        }
    }, [id]);

    useEffect(() => {
        if (boxState && boxState.hasRenderedOnce) {
            if (boxState.visible && !prevVisibleRef.current) {
                setVisibilityAnimation('fade-in');
            } else if (!boxState.visible && prevVisibleRef.current) {
                setVisibilityAnimation('fade-out');
            }
            prevVisibleRef.current = boxState.visible;
        }
    }, [boxState?.visible, boxState?.hasRenderedOnce]);

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

    useLayoutEffect(() => {
        const box = boxRef.current;
        if (!box) return;

        const boxWidth = box.offsetWidth;
        const boxHeight = box.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let newX = position.x;
        let newY = position.y;

        const maxX = windowWidth - boxWidth;
        const maxY = windowHeight - boxHeight;

        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);

        if (newX !== position.x || newY !== position.y) {
            setPosition({ x: newX, y: newY });
        }
    }, [hasMounted]); // only clamp once after mount

    useEffect(() => {
        const handleResize = () => {
            const box = boxRef.current;
            if (!box) return;

            const boxWidth = box.offsetWidth;
            const boxHeight = box.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let newX = position.x;
            let newY = position.y;

            const maxX = windowWidth - boxWidth;
            const maxY = windowHeight - boxHeight;

            newX = Math.min(Math.max(0, newX), maxX);
            newY = Math.min(Math.max(0, newY), maxY);

            setPosition({ x: newX, y: newY });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [position.x, position.y]);

    // compute outer styles/classes based on small-screen vs normal
    const outerStyle = isSmallScreen
        ? { position: 'relative', width: '97.5%', zIndex }
        : {
              position: 'absolute',
              left: position.x,
              top: position.y,
              zIndex,
              pointerEvents: boxState?.visible ? 'auto' : 'none'
          };

    return (
        <>
            {hasMounted && (!isSmallScreen || boxState?.visible) && (
                <div
                    ref={boxRef}
                    style={outerStyle}
                    className={`rounded-lg bg-gradient-to-b from-white/20 to-white/5 overflow-hidden shadow-2xl backdrop-blur-md bg-white/10
            transform transition duration-500 ease-out ${shouldAnimate ? 'animate-pop' : !isSmallScreen ? visibilityAnimation : ''}
            ${isSmallScreen ? `w-fit m-2 ${appliedOrder}` : ''}`}
                >
                    <div
                        className={`flex glass-header px-3 py-2 ${appliedHeaderColor || 'bg-linear-65 from-black to-white/5'} ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                        }`}
                        onMouseDown={handleMouseDown}
                    >
                        {appliedIcon != null && (
                            <img
                                src={appliedIcon}
                                alt="The icon of the window"
                                className={`mr-1 ${appliedIconW} ${appliedIconH} select-none pointer-events-none`}
                            />
                        )}
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(id);
                            }}
                            className="absolute top-0 right-[45px] w-8 h-6 font-bold border border-white/30 shadow-sm
               bg-gradient-to-b from-white/20 via-white/30 to-white/20
               hover:from-white/30 hover:via-white/40 hover:to-white/30
               text-white flex items-center justify-center rounded-b-sm
               transition-colors duration-200 ease-in-out
               active:translate-y-[1px] active:shadow-inner glassy-button"
                        >
                            <span className="drop-shadow-[0_1px_1px_white]">—</span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeBox(id);
                            }}
                            className="absolute top-0 right-1 w-11 h-6 font-bold border border-red-700 shadow-sm
               bg-gradient-to-b from-red-600 via-red-700 to-red-600
               hover:from-red-500 hover:via-red-600 hover:to-red-500
               text-white flex items-center justify-center
               rounded-br-sm transition-colors duration-200 ease-in-out
               active:translate-y-[1px] active:shadow-inner glassy-button"
                        >
                            <span className="drop-shadow-[0_1px_1px_black]">✕</span>
                        </button>
                    </div>

                    {/* content wrapper: respect disableDefaultWrapper and contentClassName */}
                    <div
                        className={`bg-white/20 text-black ${isSmallScreen ? '' : sizeClasses} 
              ${appliedDisableDefaultWrapper ? '' : 'px-6 py-4'} 
              ${appliedContentClassName} overflow-auto`}
                        onMouseDown={increaseZIndex}
                    >
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
