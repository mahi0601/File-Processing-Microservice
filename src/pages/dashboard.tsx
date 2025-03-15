import UploadBox from '@/components/UploadBox';
import StatsTable from '@/components/StatsTable';
import QueueStatus from '@/components/QueueStatus';
import AuthWrapper from '@/components/AuthWrapper';
import LiveStatsListener from '@/components/LiveStatsListener';

export default function Dashboard() {
  const handleLiveEvent = (data: any) => {
    console.log('🔔 Live WebSocket Event:', data);

    // Optional: Add real-time updates to UI, show toast, or update state
    // Example:
    // if (data.event === 'job-complete') alert(`Job ${data.payload.jobId} Completed!`);
  };

  return (
    <AuthWrapper>
      <div style={styles.container}>
        <h1 style={styles.heading}>📊 Log Analytics Dashboard</h1>

        {/* WebSocket Event Listener */}
        <LiveStatsListener onEvent={handleLiveEvent} />
        
        <UploadBox onUploadSuccess={(jobId) => console.log('Uploaded Job:', jobId)} />
        <QueueStatus />
        <StatsTable />
      </div>
    </AuthWrapper>
  );
}

// Styled CSS for dashboard container and heading
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    animation: 'fadeIn 0.6s ease-in-out',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '3rem 2rem',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#4f46e5',
    marginBottom: '2rem',
    textAlign: 'center',
  },
};

// Inject global keyframe animation once
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
