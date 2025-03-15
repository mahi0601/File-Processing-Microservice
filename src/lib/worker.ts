// import { Worker, Job } from 'bullmq';
// import fs from 'fs';
// import readline from 'readline';
// import { supabase } from './supabase.js';
// import { redisConnection} from './redis.js';

// const keywords = (process.env.TRACK_KEYWORDS || 'ERROR,FAIL,CRITICAL').split(',');

// export const logWorker = new Worker('log-processing-queue', async (job: Job) => {
//   const { filePath, fileId } = job.data;
//   const stats = {
//     job_id: job.id?.toString() ?? '',
//     error_count: 0,
//     keyword_hits: [] as string[],
//     ips: [] as string[],
//     created_at: new Date().toISOString(),
//   };

//   const ipSet = new Set<string>();
//   const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });

//   for await (const line of rl) {
//     if (line.includes('ERROR')) stats.error_count++;
//     keywords.forEach((kw) => line.includes(kw) && stats.keyword_hits.push(kw));
//     const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
//     if (ipMatch) ipSet.add(ipMatch[0]);
//   }
//   stats.ips = Array.from(ipSet);
//   const { error } = await supabase.from('log_stats').insert(stats);
//   if (error) throw new Error(`Supabase insert error: ${error.message}`);
// }, { connection: redisConnection });
import { Worker, Job, QueueEvents } from 'bullmq';
import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';
import { redisConnection } from './redis.js';

// WebSocket Broadcaster (assuming you have a broadcast helper function)
import { broadcast } from '../pages/api/live-stats'; // Adjust path if needed

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Keywords from ENV
const keywords = (process.env.TRACK_KEYWORDS || 'ERROR,FAIL,CRITICAL').split(',');

// Worker Implementation
export const logWorker = new Worker(
  'log-processing-queue',
  async (job: Job) => {
    const { filePath, fileName } = job.data;

    broadcast('job-started', { jobId: job.id, fileName });

    const stats = {
      job_id: job.id?.toString() ?? '',
      file_name: fileName,
      error_count: 0,
      keyword_matches: 0,
      ip_addresses: [] as string[],
      created_at: new Date().toISOString(),
    };

    const ipSet = new Set<string>();
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let lineCount = 0;

    for await (const line of rl) {
      lineCount++;

      // Count errors
      if (line.includes('ERROR')) stats.error_count++;

      // Keyword matches
      keywords.forEach((kw) => {
        if (line.includes(kw)) {
          stats.keyword_matches++;
        }
      });

      // Extract IPs
      const ipMatches = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g);
      if (ipMatches) ipMatches.forEach((ip) => ipSet.add(ip));

      // Optional: emit progress every 100 lines
      if (lineCount % 100 === 0) {
        const progress = Math.min(100, Math.round((lineCount / 1000) * 100)); // assume ~1000 lines
        await job.updateProgress(progress);
        broadcast('job-progress', { jobId: job.id, progress });
      }
    }

    stats.ip_addresses = Array.from(ipSet);

    const { error } = await supabase.from('log_stats').insert(stats);
    if (error) throw new Error(`Supabase insert error: ${error.message}`);

    return stats;
  },
  {
    concurrency: 4,
    connection: redisConnection,
  }
);

// Optional: WebSocket Events on complete/failure
const queueEvents = new QueueEvents('log-processing-queue', {
  connection: redisConnection,
});

queueEvents.on('completed', async ({ jobId }) => {
  broadcast('job-complete', { jobId });
});

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  broadcast('job-failed', { jobId, reason: failedReason });
});
