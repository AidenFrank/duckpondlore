// utils/loadBoxes.js
import images from '../boxes-data/images.json';
import textBoxes from '../boxes-data/text.json';

export async function loadBoxes() {
    const boxes = [];

    // Handle image boxes
    for (const box of images) {
        boxes.push({
            ...box,
            content: (
                <div className="flex items-center justify-center w-full h-full">
                    <img src={box.src} alt={box.alt} className={box.imageClasses} />
                </div>
            )
        });
    }

    // Handle text boxes (load HTML)
    for (const box of textBoxes) {
        const html = await fetch(`/boxes-data/content/${box.contentFile}`).then((res) => res.text());

        boxes.push({
            ...box,
            content: <div dangerouslySetInnerHTML={{ __html: html }} />
        });
    }

    return boxes;
}
