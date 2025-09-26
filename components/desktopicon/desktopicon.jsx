'use client';

import { useRef, useEffect, useState } from 'react';
import { useGlassBox } from 'context/glassboxcontext';

export default function DesktopIcon({
    title,
    icon,
    link,
    glassbox,
    iconW = 'w-12',
    iconH = 'h-12',
    initialX = 40,
    initialY = 40,
    isFlexLayout = false
}) {
    const clickCount = useRef(0);
    const clickTimer = useRef(null);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const { spawnBox } = useGlassBox();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleClick = () => {
        clickCount.current += 1;
        if (clickCount.current === 1) {
            clickTimer.current = setTimeout(() => {
                clickCount.current = 0;
            }, 300);
        } else if (clickCount.current === 2) {
            clearTimeout(clickTimer.current);
            clickCount.current = 0;
            if (link) {
                window.open(link, '_blank');
            } else if (glassbox) {
                if (typeof glassbox === 'string') {
                    spawnBox(glassbox);
                } else if (typeof glassbox === 'object' && glassbox.id) {
                    const { id, ...options } = glassbox;
                    spawnBox(id, options);
                }
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`flex flex-col items-center text-center select-none cursor-pointer m-2 transition-transform duration-200 ${
                isSmallScreen || isFlexLayout ? '' : 'absolute'
            }`}
            style={
                isSmallScreen || isFlexLayout
                    ? {}
                    : {
                          left: initialX,
                          top: initialY
                      }
            }
        >
            {/* Fixed-size container */}
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden ">
                <img
                    src={icon}
                    alt={title}
                    className={`${iconW} ${iconH} transition-transform duration-200 hover:scale-105 hover:brightness-110`}
                    draggable={false}
                />
            </div>
            <span
                className="text-xs text-white mt-1"
                style={{
                    textShadow: '1px 1px 2px black'
                }}
            >
                {title}
            </span>
        </div>
    );
}
