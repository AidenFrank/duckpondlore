// functions/boxes.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handler = async () => {
    const { data, error } = await supabase.from('boxes').select('*');

    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
