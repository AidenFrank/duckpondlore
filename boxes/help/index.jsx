import HelpContent from './helpcontent';

const HelpBox = {
    id: 'help',
    title: '⚠️ Help and Swag 😎 Information',
    initialX: 20,
    initialY: 900,
    order: 'order-1',
    sizeClasses: 'w-[1000px] h-auto', // 👈 fixed width, flexible height
    contentClassName: 'p-4', // 👈 padding inside
    content: <HelpContent />
};

export default HelpBox;
