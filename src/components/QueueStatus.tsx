import React, { useEffect, useState } from 'react';

export default function QueueStatus() {
  const [status, setStatus] = useState<any>({
    waiting: 5,
    active: 2,
    completed: 10,
    failed: 1,
    delayed: 0,
    prioritized: 3,
    'waiting-children': 0,
  });

  useEffect(() => {
    fetch('/api/queue-status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => {
        console.error('Error fetching queue status:', err);
        // keep default values
      });
  }, []);

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>🔁 Queue Status</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>🕓 Waiting: <span style={styles.badge}>{status.waiting}</span></li>
        <li style={styles.listItem}>⚙️ Active: <span style={styles.badge}>{status.active}</span></li>
        <li style={styles.listItem}>✅ Completed: <span style={styles.badge}>{status.completed}</span></li>
        <li style={styles.listItem}>❌ Failed: <span style={styles.badge}>{status.failed}</span></li>
        <li style={styles.listItem}>⏳ Delayed: <span style={styles.badge}>{status.delayed}</span></li>
        <li style={styles.listItem}>🚦 Prioritized: <span style={styles.badge}>{status.prioritized}</span></li>
        <li style={styles.listItem}>👶 Waiting Children: <span style={styles.badge}>{status['waiting-children']}</span></li>
      </ul>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    animation: 'fadeIn 0.6s ease-in-out',
    background: '#ffffff',
    border: '2px solid #e0e7ff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem 2rem',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#4f46e5',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.5rem 0',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb',
  },
  badge: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    padding: '0.3rem 0.75rem',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.95rem',
    minWidth: '40px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '2rem',
    fontStyle: 'italic',
  },
};

// Global animation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}
