'use client';

import React from 'react';

export default function ImageTemplate({
    id,
    title,
    icon,
    iconW = 'w-5',
    iconH = 'h-5',
    headerColor,
    initialX = 100,
    initialY = 100,
    sizeClasses,
    order = '',
    contentClassName = '',
    disableDefaultWrapper = false,

    // --- Image-specific props ---
    src,
    alt = '',
    imageClasses = 'w-full h-full object-contain'
}) {
    return (
        <div className={`flex items-center justify-center w-full h-full ${contentClassName}`}>
            <img src={src} alt={alt} className={imageClasses} />
        </div>
    );
}
