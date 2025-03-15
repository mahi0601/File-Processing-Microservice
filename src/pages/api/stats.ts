// import { NextApiRequest, NextApiResponse } from 'next';
// import { supabase } from '@/lib/supabase';

// export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
//   const { data, error } = await supabase
//     .from('log_stats')
//     .select('*')
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error('❌ Supabase fetch error:', error.message);
//     return res.status(500).json({ error: 'Failed to fetch stats from DB' });
//   }

//   return res.status(200).json(data);
// }
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('log_stats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
