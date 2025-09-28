// boxes/templates/article.jsx
'use client';

import React from 'react';

export default function ArticleTemplate({
    // --- Standard GlassBox props ---
    id,
    title, // GlassBox title bar
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
    disableDefaultWrapper = false,

    // --- Article-specific props ---
    heading, // 👈 internal article heading
    imageUrl,
    paragraphs = [],
    imageClasses = 'w-30 h-30 object-contain',
    headingClasses = 'text-2xl md:text-4xl font-extrabold'
}) {
    return (
        <div className={`flex flex-col gap-4 ${contentClassName}`}>
            {/* Top row: image + heading (optional) */}
            {(imageUrl || heading) && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 py-2 w-full">
                    {imageUrl && (
                        <div className="flex items-center justify-center flex-shrink-0 min-w-[80px] min-h-[80px]">
                            <img src={imageUrl} alt={heading || 'article image'} className={imageClasses} />
                        </div>
                    )}
                    {heading && (
                        <div className="flex items-center justify-center text-center md:text-left md:whitespace-nowrap">
                            <h1 className={headingClasses}>{heading}</h1>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom row: paragraphs */}
            {paragraphs.length > 0 && (
                <div className="flex items-center justify-center">
                    <div className="text-center gap-2 w-fit min-w-[250px]">
                        {paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Slot for children (if provided externally) */}
            {children}
        </div>
    );
}
