
import { useEffect, useState } from 'react';

export default function StatsTable() {
  const [stats, setStats] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const contentType = res.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setStats(data);
        } else if (data && data.length === 0) {
          setStats([]);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setError('Failed to load stats');
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="text-red-500 text-center my-4">⚠ {error}</p>;
  if (stats.length === 0) return <p className="text-gray-500 text-center my-4">No records found.</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📈 Processed Log Stats</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Job ID</th>
                <th style={styles.th}>File</th>
                <th style={styles.th}>Errors</th>
                <th style={styles.th}>Keyword Matches</th>
                <th style={styles.th}>IP Addresses</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>{stat.job_id}</td>
                  <td style={styles.td}>{stat.file_name}</td>
                  <td style={styles.td}>{stat.error_count}</td>
                  <td style={styles.td}>{stat.keyword_matches}</td>
                  <td style={styles.td}>
                    {Array.isArray(stat.ip_addresses)
                      ? stat.ip_addresses.join(', ')
                      : typeof stat.ip_addresses === 'string'
                      ? stat.ip_addresses
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Updated refined CSS
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    animation: 'fadeIn 0.6s ease-in-out',
    background: '#ffffff',
    border: '2px solid #e0e7ff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    width: '90%',
    maxWidth: '1000px',
    margin: '2rem auto',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#4f46e5',
    textAlign: 'center',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontFamily: 'sans-serif',
    textAlign: 'justify',
  },
  tableHeaderRow: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
  },
  th: {
    padding: '12px 16px',
    borderBottom: '2px solid #d1d5db',
    fontWeight: 600,
    textAlign: 'left',
  },
  tr: {
    transition: 'background 0.3s ease-in-out',
    cursor: 'pointer',
  },
  td: {
    padding: '10px 16px',
    borderBottom: '1px solid #e5e7eb',
    verticalAlign: 'top',
    textAlign: 'justify',
  },
};

// Global fadeIn animation
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
