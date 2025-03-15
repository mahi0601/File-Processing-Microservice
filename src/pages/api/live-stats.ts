// pages/api/live-stats.ts
import { Server } from 'ws';

let wss: Server | undefined;

export default function handler(req: any, res: any) {
  if (!res.socket.server.wss) {
    console.log('[LiveStats] Initializing WebSocket server...');

    const wssInstance = new Server({ noServer: true });

    req.socket.server.on('upgrade', (request: any, socket: any, head: any) => {
      wssInstance.handleUpgrade(request, socket, head, (ws) => {
        wssInstance.emit('connection', ws, request);
      });
    });

    wssInstance.on('connection', (ws) => {
      console.log('[LiveStats] WebSocket client connected ✅');
      ws.send(JSON.stringify({ event: 'connection', payload: 'Live Stats Ready ✅' }));
    });

    res.socket.server.wss = wssInstance;
    wss = wssInstance;
  }

  res.end();
}

// Broadcast utility for worker.ts
export const broadcast = (event: string, payload: any) => {
  if (!wss || !wss.clients) return;
  wss.clients.forEach((client: any) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ event, payload }));
    }
  });
};
