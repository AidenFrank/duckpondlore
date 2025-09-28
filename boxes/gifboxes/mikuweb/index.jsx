import { createImageBox } from '../../../utils/createimagebox';

const MikuwebBox = createImageBox({
    id: 'mikuweb',
    title: '🌐 Miku Web',
    src: '/gifs/mikuweb.gif',
    alt: 'Miku standing next to Windows Media Player',
    headerColor: 'bg-blue-800',
    initialX: 1050,
    initialY: 20,
    sizeClasses: 'w-[275px] h-[275px]',
    order: 'order-1'
});

export default MikuwebBox;
