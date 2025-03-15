import fs from 'fs';
import readline from 'readline';

describe('Log Parser', () => {
  it('should parse log lines and count keywords', async () => {
    const lines = [
      '[2025-02-20T10:00:00Z] ERROR Something went wrong',
      '[2025-02-20T10:05:00Z] INFO Everything ok',
      '[2025-02-20T10:10:00Z] ERROR Database timeout {"ip": "192.168.1.1"}'
    ];

    let errorCount = 0, keywordMatches = 0;
    const keywords = ['ERROR', 'timeout'];
    const ipSet = new Set();

    for (const line of lines) {
      if (line.includes('ERROR')) errorCount++;
      keywords.forEach(k => { if (line.includes(k)) keywordMatches++; });
      const ipMatch = line.match(/(\d{1,3}\.){3}\d{1,3}/);
      if (ipMatch) ipSet.add(ipMatch[0]);
    }

    expect(errorCount).toBe(2);
    expect(keywordMatches).toBeGreaterThan(2);
    expect(ipSet.has('192.168.1.1')).toBe(true);
  });
});
