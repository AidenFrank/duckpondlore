import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';
import DesktopIconManager from 'components/desktopicon/desktopiconmanager';
import Footer from 'components/footer/footer';
import FooterSpacer from 'components/footer/footerspacer';

export default function Page() {
    return (
        <>
            <GlassBoxProvider
                initialBoxInstances={[
                    { id: 'about', type: 'about' },
                    { id: 'help', type: 'help' },
                    { id: 'frutigeraero1', type: 'frutigeraero1' },
                    { id: 'walkingduck', type: 'walkingduck' },
                    { id: 'butterdog1', type: 'butterdog' },
                    { id: 'mikudance', type: 'mikudance' }
                ]}
            >
                <div className="relative w-screen h-screen overflow-x-hidden">
                    <GlassBoxManager />
                    <DesktopIconManager iconIds={['test', 'duck', 'oldwiki']} />
                    <FooterSpacer />
                    <Footer />
                </div>
            </GlassBoxProvider>
        </>
    );
}
