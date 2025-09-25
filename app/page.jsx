import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';

export default function Page() {
    return (
        <>
            <GlassBoxProvider>
                <div className='relative w-screen h-screen overflow-x-hidden'>
                    <GlassBoxManager boxIds={['about', 'butterdog', 'walkingduck', 'frutigeraero1']}/>
                </div>
            </GlassBoxProvider>
        </>
    );
}