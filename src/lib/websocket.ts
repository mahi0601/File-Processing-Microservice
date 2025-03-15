export const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:3000/api/live-stats');
    socket.onopen = () => console.log('✅ WebSocket connected');
    socket.onmessage = (msg) => console.log('📡 Message:', msg.data);
    socket.onerror = (e) => console.error('❌ WebSocket error:', e);
    return socket;
  };