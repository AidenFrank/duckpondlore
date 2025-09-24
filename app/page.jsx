import { GlassBoxProvider } from '../context/GlassBoxContext';
import GlassBoxManager from '../components/GlassBoxManager';

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