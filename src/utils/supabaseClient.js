import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
                    import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseUrl.startsWith('https://') && supabaseKey);
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Helper to fetch jobs from Supabase with fallback
 */
export async function getJobsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetch jobs error:', err.message);
    return null;
  }
}

/**
 * Helper to fetch products from Supabase with fallback
 */
export async function getProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase fetch products error:', err.message);
    return null;
  }
}

/**
 * Helper to save a job application to Supabase
 */
export async function saveApplicationToSupabase(application) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('applications').insert([application]).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase save application error:', err.message);
    return null;
  }
}

/**
 * Helper to save an order to Supabase
 */
export async function saveOrderToSupabase(order) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('orders').insert([order]).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase save order error:', err.message);
    return null;
  }
}
