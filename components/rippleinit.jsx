'use client';

import { useEffect } from 'react';

export default function RippleInit() {
    useEffect(() => {
        const $ = window.jQuery;
        const el = document.getElementById('ripple-background');

        const initRipples = () => {
            if ($ && el && typeof $(el).ripples === 'function') {
                $(el).ripples('destroy');
                $(el).ripples({
                    resolution: 256,
                    dropRadius: 20,
                    perturbance: 0.04
                });

                el.addEventListener('click', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    $(el).ripples('drop', x, y, 20, 0.1);
                });
            }
        };

        // Delay to ensure background is rendered
        const timeout = setTimeout(initRipples, 300);

        return () => {
            clearTimeout(timeout);
            if ($ && el && typeof $(el).ripples === 'function') {
                $(el).ripples('destroy');
            }
        };
    }, []);

    return null;
}
