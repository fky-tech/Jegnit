import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'

// Client side debugging
// console.log('[Supabase] Env Check:', { 
//   urlFound: !!process.env.NEXT_PUBLIC_SUPABASE_URL, 
//   keyFound: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
// });

export const supabase = createClient(supabaseUrl, supabaseKey)
