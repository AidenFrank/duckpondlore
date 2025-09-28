import { createImageBox } from '../../../utils/createimagebox';

const MikudanceBox = createImageBox({
    id: 'mikudance',
    title: 'Miku be Dancin!!!',
    src: '/gifs/mikudance.gif',
    alt: 'Miku be dancin',
    icon: '/images/mikuleek.webp',
    headerColor: 'bg-blue-800',
    initialX: 20,
    initialY: 550,
    order: 'order-9',
    sizeClasses: 'w-[300px] h-[300px]', // 👈 sets box size (outer)
    imageClasses: 'w-full h-full object-contain' // 👈 fits inside with padding
});

export default MikudanceBox;
