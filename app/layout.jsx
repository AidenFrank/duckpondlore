import '../styles/globals.css';
import Script from 'next/script';
import RippleInit from '../components/rippleinit';
import WaterBackground from '../components/waterbackground';
import Footer from '/components/footer/footer';

const waterBackgrounds = ['/images/water1.jpg', '/images/water2.jpg', '/images/water3.jpg'];

const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * waterBackgrounds.length);
    return waterBackgrounds[randomIndex];
};

export default function RootLayout({ children }) {
    const imageURL = getRandomBackground();

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
