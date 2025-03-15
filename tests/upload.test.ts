import handler from '../src/pages/api/upload-logs.js';
import { createMocks } from 'node-mocks-http';

describe('POST /api/upload-logs', () => {
  it('should return method not allowed if not POST', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
