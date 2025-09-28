// boxes/registry.jsx
import { templates } from './templates';

export async function loadBoxes() {
    const res = await fetch('/.netlify/functions/boxes');
    if (!res.ok) {
        console.error('Failed to load boxes:', res.statusText);
        return {};
    }
    const rows = await res.json();

    const registry = {};

    rows.forEach((row) => {
        const Template = templates[row.template];
        if (!Template) return;

        registry[row.id] = async () => ({
            id: row.id,
            template: row.template,
            title: row.title ?? '',
            heading: row.heading ?? null,
            icon: row.icon ?? null,
            iconW: row.icon_w ?? 'w-5',
            iconH: row.icon_h ?? 'h-5',
            headerColor: row.header_color ?? null,
            initialX: row.initial_x ?? 100,
            initialY: row.initial_y ?? 100,
            sizeClasses: row.size_classes ?? 'w-[400px] h-auto',
            order: row.sort_order ?? '',
            contentClassName: row.content_class_name ?? '',
            disableDefaultWrapper: row.disable_default_wrapper ?? false,
            Template,
            ...(row.data && typeof row.data === 'object' ? row.data : {})
        });
    });

    return registry;
}
