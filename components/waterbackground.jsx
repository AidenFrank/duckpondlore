'use client';

import { useEffect, useState } from 'react';

const waterBackgrounds = [
  '/images/water1.jpg',
  '/images/water2.jpg',
  '/images/water3.jpg',
];

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
      className="w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${imageURL})` }}
    >
      {children}
    </div>
  );
}
