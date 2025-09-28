import { createImageBox } from '../../../utils/createimagebox';

const ButterDogBox = createImageBox({
    id: 'butterdog',
    title: '🧈 Butter Dog',
    src: '/gifs/dog-with-butter.gif',
    alt: 'A dog with butter on its head',
    initialX: 350,
    initialY: 325,
    order: 'order-2',
    sizeClasses: 'w-[500px] h-[500px]', // 👈 sets box size (outer)
    imageClasses: 'w-full h-full object-contain' // 👈 fits inside with padding
});

export default ButterDogBox;
