'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public bucket name + folder
const BUCKET = 'Ducket';
const FOLDER = 'images/backgrounds';

export default function WaterBackground({ children }) {
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        async function loadBackground() {
            try {
                const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, { limit: 100 });

                if (error) throw error;

                if (data && data.length > 0) {
                    const files = data.filter((f) => f.name.endsWith('.jpg') || f.name.endsWith('.png'));
                    if (files.length > 0) {
                        const randomFile = files[Math.floor(Math.random() * files.length)].name;
                        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${FOLDER}/${randomFile}`;
                        setImageURL(publicUrl);
                        return;
                    }
                }
            } catch (err) {
                console.error('[WaterBackground] Failed to fetch backgrounds:', err);
            }

            // Fallback to hardcoded if fetch fails
            const fallback = [
                'https://iqvrofvianevyesklgjt.supabase.co/storage/v1/object/public/Ducket/images/backgrounds/water1.jpg',
                'https://iqvrofvianevyesklgjt.supabase.co/storage/v1/object/public/Ducket/images/backgrounds/water2.jpg',
                'https://iqvrofvianevyesklgjt.supabase.co/storage/v1/object/public/Ducket/images/backgrounds/water3.jpg'
            ];
            const randomFile = fallback[Math.floor(Math.random() * fallback.length)];
            setImageURL(randomFile);
        }

        loadBackground();
    }, []);

    return (
        <div
            id="ripple-background"
            className="w-full min-h-screen bg-repeat-y bg-center bg-fixed"
            style={{
                backgroundImage: imageURL ? `url(${imageURL})` : 'none',
                backgroundSize: '100% auto'
            }}
        >
            <div className="w-full min-h-screen bg-gradient-to-b from-white/10 to-white/0">{children}</div>
        </div>
    );
}
