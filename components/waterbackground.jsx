'use client';

import { useEffect, useState } from 'react';

const waterBackgrounds = ['/images/water1.jpg', '/images/water2.jpg', '/images/water3.jpg'];

const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * waterBackgrounds.length);
    return waterBackgrounds[randomIndex];
};

export default function WaterBackground({ children }) {
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        setImageURL(getRandomBackground());
    }, []);

    return (
        <div
            id="ripple-background"
            className="w-full bg-repeat-y bg-center bg-fixed"
            style={{
                backgroundImage: `url(${imageURL})`,
                backgroundSize: '100% auto' // stretch horizontally, repeat vertically
            }}
        >
            {/* Optional overlay for subtle fade */}
            <div className="w-full min-h-screen bg-gradient-to-b from-white/10 to-white/0">{children}</div>
        </div>
    );
}
