'use client';

import { useEffect } from 'react';

export default function RippleInit() {
  useEffect(() => {
    const $ = window.jQuery;
    const el = document.getElementById('ripple-background');

    const tryInit = () => {
      if ($ && el && typeof $(el).ripples === 'function') {
        // Destroy any previous instance
        $(el).ripples('destroy');

        // Initialize ripple plugin
        $(el).ripples({
          resolution: 256,
          dropRadius: 20,
          perturbance: 0.04,
        });

        // Click-triggered ripple only
        el.addEventListener('click', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          $(el).ripples('drop', x, y, 20, 0.1);
        });
      } else {
        setTimeout(tryInit, 100);
      }
    };

    tryInit();

    return () => {
      if ($ && el && typeof $(el).ripples === 'function') {
        $(el).ripples('destroy');
      }
    };
  }, []);

  return null;
}
