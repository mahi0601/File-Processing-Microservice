// // import { Worker } from 'bullmq';
// // import fs from 'fs';
// // import readline from 'readline';
// // import { supabase } from '../lib/supabase.js';
// // import { logQueue } from '../lib/bullmq.js';


// // const KEYWORDS = ['error', 'failed', 'timeout', 'warning', 'disk full'];

// // export const logProcessorWorker = new Worker(
// //   'logQueue',
// //   async (job) => {
// //     const { filePath, fileName } = job.data;
// //     console.log(`👷 Processing ${fileName}...`);

// //     let errorCount = 0;
// //     let keywordMatches = 0;
// //     const ipSet = new Set<string>();

// //     const rl = readline.createInterface({
// //       input: fs.createReadStream(filePath),
// //       crlfDelay: Infinity,
// //     });

// //     for await (const line of rl) {
// //       const lower = line.toLowerCase();

// //       if (lower.includes('error')) errorCount++;
// //       for (const keyword of KEYWORDS) {
// //         if (lower.includes(keyword)) {
// //           keywordMatches++;
// //           break;
// //         }
// //       }

// //       const ipMatches = line.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);
// //       if (ipMatches) ipMatches.forEach(ip => ipSet.add(ip));
// //     }

// //     const ipAddresses = Array.from(ipSet).join(', ');

// //     const { error } = await supabase.from('log_stats').insert([
// //       {
// //         job_id: job.id,
// //         file_name: fileName,
// //         error_count: errorCount,
// //         keyword_matches: keywordMatches,
// //         ip_addresses: ipAddresses,
// //         created_at: new Date().toISOString(),
// //       },
// //     ]);

// //     if (error) console.error('❌ Supabase insert error:', error.message);
// //     else console.log(`✅ Stats inserted for job ${job.id}`);

// //     return { status: 'done' };
// //   },
// //   { connection: logQueue.opts.connection }
// // );
// import { Worker, QueueEvents, Job } from 'bullmq';
// import fs from 'fs';
// import readline from 'readline';
// import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config();

// const redisConfig = {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//   },
// };

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// const keywords = (process.env.KEYWORDS || '').split(',');

// // Worker to process log files
// const worker = new Worker('log-processing-queue', async (job: Job) => {
//   const { filePath, fileName, jobId } = job.data;

//   let errorCount = 0;
//   let keywordMatches = 0;
//   const ipSet = new Set<string>();

//   const fileStream = fs.createReadStream(filePath);

//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });

//   for await (const line of rl) {
//     // Count errors
//     if (line.includes('ERROR')) {
//       errorCount++;
//     }

//     // Count keyword matches
//     keywords.forEach((kw) => {
//       if (line.toLowerCase().includes(kw.toLowerCase())) {
//         keywordMatches++;
//       }
//     });

//     // Extract IPs using regex
//     const ipRegex = /(\d{1,3}\.){3}\d{1,3}/g;
//     const matches = line.match(ipRegex);
//     if (matches) {
//       matches.forEach((ip) => ipSet.add(ip));
//     }
//   }

//   // Insert stats into Supabase
//   const { error } = await supabase.from('log_stats').insert([
//     {
//       job_id: jobId,
//       file_name: fileName,
//       error_count: errorCount,
//       keyword_matches: keywordMatches,
//       ip_addresses: Array.from(ipSet).join(', '),
//       created_at: new Date().toISOString(),
//     },
//   ]);

//   if (error) {
//     console.error('Supabase insert error:', error.message);
//     throw new Error('Failed to save log stats');
//   }

//   return {
//     errorCount,
//     keywordMatches,
//     ipAddresses: Array.from(ipSet),
//   };
// }, {
//   ...redisConfig,
//   concurrency: 4,
// });

// // Event listeners
// const queueEvents = new QueueEvents('log-processing-queue', redisConfig);
// queueEvents.on('completed', ({ jobId }) => {
//   console.log(`✅ Job ${jobId} completed.`);
// });

// queueEvents.on('failed', ({ jobId, failedReason }) => {
//   console.error(`❌ Job ${jobId} failed: ${failedReason}`);
// });
import { Worker, QueueEvents, Job } from 'bullmq';
import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const keywords = (process.env.KEYWORDS || '').split(',');

// Worker to process log files
const worker = new Worker('log-processing-queue', async (job: Job) => {
  const { filePath, fileName, jobId } = job.data;

  let errorCount = 0;
  let keywordMatches = 0;
  const ipSet = new Set<string>();

  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Count errors
    if (line.includes('ERROR')) {
      errorCount++;
    }

    // Count keyword matches
    keywords.forEach((kw) => {
      if (line.toLowerCase().includes(kw.toLowerCase())) {
        keywordMatches++;
      }
    });

    // Extract IPs using regex
    const ipRegex = /(\d{1,3}\.){3}\d{1,3}/g;
    const matches = line.match(ipRegex);
    if (matches) {
      matches.forEach((ip) => ipSet.add(ip));
    }
  }

  // Insert stats into Supabase
  const { error } = await supabase.from('log_stats').insert([
    {
      job_id: jobId,
      file_name: fileName,
      error_count: errorCount,
      keyword_matches: keywordMatches,
      ip_addresses: Array.from(ipSet).join(', '),
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Supabase insert error:', error.message);
    throw new Error('Failed to save log stats');
  }

  return {
    errorCount,
    keywordMatches,
    ipAddresses: Array.from(ipSet),
  };
}, {
  ...redisConfig,
  concurrency: 4,
});

// Event listeners
const queueEvents = new QueueEvents('log-processing-queue', redisConfig);
queueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed.`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Job ${jobId} failed: ${failedReason}`);
});
