import { createImageBox } from '../../../utils/createimagebox';

const Frutigeraero1Box = createImageBox({
    id: 'frutigeraero1',
    title: '🐠🐟🐡 Please enjoy your stay🐬🌞😎',
    src: '/gifs/frutigergif1.gif',
    alt: 'Fish and a blue sky',
    headerColor: 'bg-linear-65 from-sky-900 to-white/5',
    initialX: 900,
    initialY: 350,
    order: 'order-4',
    sizeClasses: 'w-[500px] h-[500px]', // 👈 sets box size (outer)
    imageClasses: 'w-full h-full object-contain' // 👈 fits inside with padding
});

export default Frutigeraero1Box;
