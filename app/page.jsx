import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';
import DesktopIconManager from 'components/desktopicon/desktopiconmanager';

export default function Page() {
    return (
        <>
            <GlassBoxProvider>
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <GlassBoxManager
                        boxInstances={[
                            { id: 'help', type: 'help' },
                            { id: 'frutigeraero1', type: 'frutigeraero1' },
                            { id: 'walkingduck', type: 'walkingduck' },
                            { id: 'about', type: 'about' },
                            { id: 'butterdog1', type: 'butterdog' }
                        ]}
                    />
                    <DesktopIconManager iconIds={['test', 'duck', 'oldwiki']} />
                </div>
            </GlassBoxProvider>
        </>
    );
}
