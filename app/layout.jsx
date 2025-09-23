import '../styles/globals.css';


import Script from 'next/script';
import RippleInit from '../components/RippleInit';

const waterBackgrounds = [
  '/images/water1.jpg',
  '/images/water2.jpg',
  '/images/water3.jpg',
];

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
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js" strategy="beforeInteractive" />
      </head>
      <body>
        <RippleInit />
        <div
          id="ripple-background"
          className="w-full min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${imageURL})` }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}

