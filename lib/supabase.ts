import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxkhbyojakiklbzbpgph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4a2hieW9qYWtpa2xiemJwZ3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjIzMjgsImV4cCI6MjA4MzE5ODMyOH0.iDPGgqidotnbzj5iT2rdASakSZVRATc2wxoCMrREL2w';

export const supabase = createClient(supabaseUrl, supabaseKey);