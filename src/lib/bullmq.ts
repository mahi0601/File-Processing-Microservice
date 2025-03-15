import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? '';

if (!redisUrl) {
  throw new Error('❌ REDIS_URL is not defined in environment variables. Please add it to your .env file.');
}

const connection = new IORedis(redisUrl);

const logQueue = new Queue('log-processing-queue', {
  connection,
});

export { logQueue, connection };
