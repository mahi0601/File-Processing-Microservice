import { useEffect, useState } from 'react';

interface LiveEvent {
  event: string;
  payload: any;
  timestamp: string;
}

export default function LiveStatsListener({ onEvent }: { onEvent: (event: any) => void }) {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [eventLog, setEventLog] = useState<LiveEvent[]>([
    {
      event: 'job-started',
      payload: { jobId: 'demo-123', fileName: 'sample.log' },
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      event: 'job-progress',
      payload: { jobId: 'demo-123', progress: 50 },
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      event: 'job-complete',
      payload: { jobId: 'demo-123' },
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/api/live-stats`);

    ws.onopen = () => {
      console.log('[LiveStats] WebSocket connected');
      setStatus('connected');
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        onEvent(data);

        setEventLog((prev) => [
          { ...data, timestamp: new Date().toLocaleTimeString() },
          ...prev.slice(0, 9), // keep max 10 recent events
        ]);
      } catch (err) {
        console.error('WebSocket Parse Error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('[LiveStats] WebSocket Error:', err);
      setStatus('disconnected');
    };

    ws.onclose = () => {
      console.log('[LiveStats] WebSocket disconnected');
      setStatus('disconnected');
    };

    return () => ws.close();
  }, [onEvent]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.statusBox}>
        <span style={status === 'disconnected' ? styles.connected : styles.disconnected}>
          {status === 'disconnected' ? '🟢 Live Stats Connected' : '🔴 Disconnected from Live Stats'}
        </span>
      </div>

      <h4 style={styles.tableTitle}>📡 Live Job Events</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Event Type</th>
              <th style={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {eventLog.map((event, idx) => (
              <tr key={idx} style={styles.tr}>
                <td style={styles.td}>{event.timestamp}</td>
                <td style={styles.td}>{event.event}</td>
                <td style={styles.td}>
                  {Object.entries(event.payload)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    marginBottom: '2rem',
  },
  statusBox: {
    animation: 'fadeIn 0.6s ease-in-out',
    backgroundColor: '#f9fafb',
    border: '1px solid #e0e7ff',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  connected: {
    color: '#16a34a',
  },
  disconnected: {
    color: '#dc2626',
  },
  tableTitle: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.25rem',
    color: '#4f46e5',
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontFamily: 'sans-serif',
  },
  tableHeaderRow: {
    backgroundColor: '#e0e7ff',
  },
  th: {
    padding: '10px',
    border: '1px solid #cbd5e1',
    textAlign: 'center',
    fontWeight: 600,
    color: '#4f46e5',
  },
  tr: {
    transition: 'background 0.3s ease',
  },
  td: {
    padding: '10px',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
    fontSize: '0.95rem',
  },
};

// Inject animation globally
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    tr:hover {
      background-color: #f3f4f6 !important;
    }
  `;
  document.head.appendChild(style);
}
