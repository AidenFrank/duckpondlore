'use client';

// 🔑 Example of all possible overrides for a box instance
// Copy + tweak this when you want a duplicate or custom box without editing Supabase
/*
{
  sourceId: 'mikuweb',     // required — links to the canonical box config in Supabase or JSON

  // 📝 Any of these are optional — they override the canonical box’s values at runtime
  overrides: {
    // Basic identity
    title: 'MikuWeb 2',       // replaces the box’s title
    icon: '/icons/miku.png',  // custom icon (path or URL)
    iconW: 'w-6',             // Tailwind width class for icon
    iconH: 'h-6',             // Tailwind height class for icon

    // Position & layout
    initialX: 400,            // start X position (px)
    initialY: 200,            // start Y position (px)
    sizeClasses: 'w-96 h-72', // custom Tailwind size (width/height)

    // Styling
    headerColor: 'bg-blue-800',                        // solid Tailwind class
    // OR (if using inline gradients stored in Supabase) — see our runtime CSS logic:
    headerColor: 'linear-gradient(65deg, skyblue, #fff)',

    contentClassName: 'prose prose-invert',            // extra Tailwind for content area
    order: 'order-2',                                  // controls order in flex layouts

    // Behavior toggles
    disableDefaultWrapper: true,   // removes the default content padding wrapper
    visible: true,                 // whether the box spawns opened (default true)
  }
}
*/

import { GlassBoxProvider } from '../context/glassboxcontext';
import GlassBoxManager from '../components/glassboxmanager';
import DesktopIconManager from 'components/desktopicon/desktopiconmanager';
import Footer from 'components/footer/footer';
import FooterSpacer from 'components/footer/footerspacer';

export default function Page() {
    return (
        <GlassBoxProvider
            initialBoxInstances={[
                { sourceId: 'about' },
                { sourceId: 'help' },
                { sourceId: 'frutigeraero1' },
                { sourceId: 'walkingduck' },
                { sourceId: 'mikuweb' }
            ]}
        >
            <div className="relative w-screen h-screen overflow-x-hidden">
                <GlassBoxManager />
                <DesktopIconManager iconIds={['test', 'duck', 'oldwiki']} />
                <FooterSpacer />
                <Footer />
            </div>
        </GlassBoxProvider>
    );
}
