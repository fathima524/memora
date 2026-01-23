
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function getSubjects() {
    const { data, error } = await supabase.from('subjects').select('id, name');
    if (error) {
        console.error('Error fetching subjects:', error);
        return;
    }
    console.log('--- Subject IDs Mapping ---');
    data.forEach(s => {
        console.log(`${s.name}: ${s.id}`);
    });
}

getSubjects();
