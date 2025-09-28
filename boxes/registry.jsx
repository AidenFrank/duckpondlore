// boxes/registry.jsx
import { templates } from './templates';

export async function loadBoxes() {
    const [imageData, textData] = await Promise.all([
        fetch('/boxes-data/images.json').then((res) => res.json()),
        fetch('/boxes-data/text.json').then((res) => res.json())
    ]);

    const registry = {};

    // --- Template-driven boxes (text/article, image, etc.) ---
    [...imageData, ...textData].forEach((box) => {
        const Template = templates[box.template];
        if (Template) {
            registry[box.id] = async () => ({
                // Defaults for all boxes
                id: box.id,
                template: box.template,
                title: box.title || '',
                heading: box.heading || null,
                icon: box.icon || null,
                iconW: box.iconW || 'w-5',
                iconH: box.iconH || 'h-5',
                headerColor: box.headerColor || null,
                initialX: box.initialX ?? 100,
                initialY: box.initialY ?? 100,
                sizeClasses: box.sizeClasses || 'w-[400px] h-auto',
                order: box.order || '',
                contentClassName: box.contentClassName || '',
                disableDefaultWrapper: box.disableDefaultWrapper || false,

                // Template reference
                Template,

                // Template-specific props (pass through whatever exists)
                ...box
            });
        }
    });

    return registry;
}
