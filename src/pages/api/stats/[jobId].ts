
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;

  const { data, error } = await supabase
    .from('log_stats')
    .select('*')
    .eq('job_id', jobId)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
