import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';
import DesktopIconManager from 'components/desktopicon/desktopiconmanager';

export default function Page() {
    return (
        <>
            <GlassBoxProvider>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <GlassBoxManager boxIds={['about', 'help', 'butterdog', 'walkingduck', 'frutigeraero1']} />
                    <DesktopIconManager iconIds={['test', 'duck', 'oldwiki']} />
                </div>
            </GlassBoxProvider>
        </>
    );
}
