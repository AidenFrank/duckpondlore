// netlify/functions/boxes.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function handler(event, context) {
    try {
        const { data, error } = await supabase.from('boxes').select('*').order('sort_order', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Database query failed' })
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
    } catch (err) {
        console.error('Function error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unexpected error' })
        };
    }
}
