import { GlassBox } from 'components/glassbox';
import About from '/components/glassContent/about';

export default function Page() {
    return (
        <>
            <div className='flex flex-wrap'>
                <GlassBox title="Haii!!!" icon="\gifs\smileywave.gif" iconW='w-8' headerColor={"from-green-900"} initialX={20} initialY={20} order="order-1">
                    <About />
                </GlassBox>
            </div>
        </>
    );
}