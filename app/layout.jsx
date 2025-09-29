import '../styles/globals.css';
import Script from 'next/script';
import RippleInit from '../components/rippleinit';
import WaterBackground from '../components/waterbackground';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
                <Script
                    src="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js"
                    strategy="beforeInteractive"
                />
                <title>The Duckpond</title>
                <link rel="icon" href="/The_Duckpond.ico" />
            </head>
            <body>
                <RippleInit />
                <WaterBackground>{children}</WaterBackground>
            </body>
        </html>
    );
}
