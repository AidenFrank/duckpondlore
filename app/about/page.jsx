import { GlassBox } from 'components/glassbox';

export default function AboutPage() {
  return (
    <>
        <GlassBox title="The Duckpond" icon="\images\The_Duckpond.png" headerColor={"from-green-900"} initialX={20} initialY={20}>
            <img className="size-1/4" src="\images\The_Duckpond.png" alt='The Duckpond logo'></img>
            <p>Ziggy was here! :P</p>
        </GlassBox>
    </>
  );
}
