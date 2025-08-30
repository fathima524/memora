import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snqjvffberwghpwmsuiv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWp2ZmZiZXJ3Z2hwd21zdWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDIzMzEsImV4cCI6MjA3MjExODMzMX0.smIvwTsg77OlETY8tjiYwinPamKhvtlDtKz8TCct7fI';

export const supabase = createClient(supabaseUrl, supabaseKey);
