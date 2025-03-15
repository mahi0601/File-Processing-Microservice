
import { Queue } from 'bullmq';
import { NextApiRequest, NextApiResponse } from 'next';

const queue = new Queue('log-processing-queue', {
  connection: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const counts = await queue.getJobCounts();
  res.status(200).json(counts);
}
