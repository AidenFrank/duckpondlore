import { GlassBox } from 'components/glassbox';

export default function Page() {
    return (
        <>
            <div className='flex flex-wrap'>
                <GlassBox title="The Duckpond" icon="\images\The_Duckpond.png" headerColor={"from-green-900"} initialX={20} initialY={20}>
                    <img className="size-1/4" src="\images\The_Duckpond.png" alt='The Duckpond logo'></img>
                    <p>Ziggy was here! :P</p>
                </GlassBox>
                <GlassBox title="The Second Glass Box" headerColor={"from-red-900"} initialX={100} initialY={100}>
                    <p>Me oh my, i&#39;m the second guy!</p>
                </GlassBox>
                <GlassBox title="The Third Glass Box" initialX={200} initialY={200}>
                    <p>It&#39;s starting to get crowded in here...</p>
                </GlassBox>
            </div>
        </>
    );
}