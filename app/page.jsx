import { GlassBox } from 'components/glassbox';

export default function Page() {
    return (
        <>
            <div className='flex flex-wrap'>
                <GlassBox title="The Duckpond" initialX={100} initialY={100}>
                    <img className="size-1/4" src="\images\The_Duckpond.png"></img>
                    <p>Ziggy was here! :P</p>
                </GlassBox>
            </div>
        </>
    );
}