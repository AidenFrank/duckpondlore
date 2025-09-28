import AboutContent from './aboutcontent';

const AboutBox = {
    id: 'about',
    title: 'Haii!!!',
    icon: '/gifs/smileywave.gif',
    iconW: 'w-8',
    headerColor: 'bg-linear-65 from-green-900 to-white/5',
    initialX: 350,
    initialY: 20,
    order: 'order-1',
    contentClassName: 'flex flex-col items-center gap-4',
    content: <AboutContent />
};

export default AboutBox;
