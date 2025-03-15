import React, { useState } from 'react';

export default function UploadBox({ onUploadSuccess }: { onUploadSuccess: (jobId: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please choose a log file');
    const formData = new FormData();
    formData.append('logFile', file);
    setLoading(true);

    try {
      const res = await fetch('/api/upload-logs', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      alert(`✅ Uploaded! Job ID: ${data.jobId}`);
      onUploadSuccess(data.jobId);
    } catch (err) {
      alert('❌ Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>📤 Upload Log File</h3>

      <label htmlFor="file-upload" style={styles.uploadLabel}>
        {file ? file.name : 'Choose File'}
        <input
          id="file-upload"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={styles.fileInput}
        />
      </label>

      <button
        onClick={handleUpload}
        style={loading ? styles.buttonDisabled : styles.button}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

// Styled inline CSS object
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    animation: 'fadeIn 0.6s ease-in-out',
    background: '#ffffff',
    border: '2px solid #e0e7ff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    maxWidth: '500px',
    margin: '2rem auto',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#4f46e5',
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    marginBottom: '1rem',
    borderRadius: '12px',
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px dashed #4f46e5',
    transition: 'all 0.3s ease-in-out',
  },
  fileInput: {
    display: 'none',
  },
  button: {
    padding: '0.75rem 2rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  buttonDisabled: {
    padding: '0.75rem 2rem',
    backgroundColor: '#a5b4fc',
    color: '#f9fafb',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'not-allowed',
  },
};

// Add global keyframe animation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    button:hover {
      background-color: #4338ca !important;
    }
    label:hover {
      background-color: #dbeafe !important;
    }
  `;
  document.head.appendChild(style);
}
