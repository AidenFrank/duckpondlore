// utils/createimagebox.jsx
export function createImageBox({
    id,
    title,
    src,
    alt,
    headerColor,
    icon,
    iconW = 'w-5',
    iconH = 'h-5',
    initialX = 100,
    initialY = 100,
    sizeClasses = 'w-[300px] h-[300px]',
    order = 'order-1'
}) {
    return {
        id,
        title,
        icon,
        iconW,
        iconH,
        headerColor,
        initialX,
        initialY,
        sizeClasses,
        order,
        disableContentWrapper: true,
        content: (
            <div className="flex items-center justify-center w-full h-full">
                <img src={src} alt={alt} className="w-full h-full object-contain" />
            </div>
        )
    };
}
