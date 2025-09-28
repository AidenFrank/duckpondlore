import { createImageBox } from '../../../utils/createimagebox';

const WalkingduckBox = createImageBox({
    id: 'walkingduck',
    title: 'QUACK',
    src: '/gifs/walkingduck.gif',
    alt: 'A duck walking',
    icon: '/gifs/walkingduck.gif',
    headerColor: 'bg-linear-65 from-orange-500 to-white/5',
    initialX: 20,
    initialY: 300,
    sizeClasses: 'w-[200px] h-[200px]', // 👈 sets box size (outer)
    imageClasses: 'w-full h-full object-contain' // 👈 fits inside with padding
});

export default WalkingduckBox;
