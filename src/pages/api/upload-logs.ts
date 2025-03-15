
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { Queue } from 'bullmq';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const queue = new Queue('log-processing-queue', {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Upload failed' });
    }

    console.log('FIELDS:', fields);
    console.log('FILES:', files);

    // Accept various casing: logFile / logfile / file
    const uploadedFile =
      (files?.logFile || files?.logfile || files?.file) as File | File[];

    let filePath: string | undefined;
    let fileName: string | undefined;

    if (Array.isArray(uploadedFile)) {
      filePath = uploadedFile[0]?.filepath;
      fileName = uploadedFile[0]?.originalFilename;
    } else if (uploadedFile) {
      filePath = uploadedFile.filepath;
      fileName = uploadedFile.originalFilename;
    }

    if (!filePath || !fileName) {
      console.error('❌ Missing filePath or fileName:', filePath, fileName);
      return res.status(400).json({ message: 'No valid file uploaded' });
    }

    const jobId = uuidv4();

    await queue.add(
      'log-process',
      { filePath, fileName, jobId },
      {
        attempts: 3,
        removeOnComplete: true,
        priority: 1,
      }
    );

    return res.status(200).json({ success: true, jobId });
  });
}
