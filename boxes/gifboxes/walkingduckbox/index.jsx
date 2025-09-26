import WalkingduckContent from './walkingduckcontent.jsx';

const WalkingduckBox = {
    id: 'walkingduck',
    title: 'QUACK',
    icon: '/gifs/walkingduck.gif',
    headerColor: 'from-red-900',
    initialX: 20,
    initialY: 325,
    sizeClasses: 'w-[200px] h-[200px]',
    order: 'order-3',
    content: <WalkingduckContent />
};

export default WalkingduckBox;
