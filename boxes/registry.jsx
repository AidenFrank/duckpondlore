// boxes/registry.jsx
import { templates } from './templates';

function mapRowToConfig(row) {
    const data = row.data || {};
    return {
        ...data, // spread first so row fields override
        id: row.id,
        template: row.template,
        title: row.title ?? data.title ?? '',
        heading: row.heading ?? data.heading ?? null,
        icon: row.icon ?? data.icon ?? null,
        iconW: row.icon_w ?? 'w-5',
        iconH: row.icon_h ?? 'h-5',
        headerColor: row.header_color ?? data.headerColor ?? null,
        initialX: row.initial_x ?? data.initialX ?? 100,
        initialY: row.initial_y ?? data.initialY ?? 100,
        sizeClasses: row.size_classes ?? data.sizeClasses ?? 'w-[400px] h-auto',
        order: row.sort_order ?? data.order ?? null,
        contentClassName: row.content_class_name ?? '',
        disableDefaultWrapper: row.disable_default_wrapper ?? false
    };
}

export async function loadBoxes() {
    const res = await fetch('/.netlify/functions/boxes');
    if (!res.ok) throw new Error(`Failed to fetch boxes: ${res.status}`);
    const rows = await res.json();

    const registry = {};
    rows.forEach((row) => {
        const cfg = mapRowToConfig(row);
        const Template = templates[cfg.template];
        if (!Template) return;
        registry[cfg.id] = async () => ({ ...cfg, Template });
    });

    return registry;
}
