import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';

export default function Page() {
    return (
        <>
            <GlassBoxProvider>
                <div className='flex flex-wrap'>
                    <GlassBoxManager boxIds={['about', 'butterdog', 'walkingduck', 'frutigeraero1']}/>
                </div>
            </GlassBoxProvider>
        </>
    );
}