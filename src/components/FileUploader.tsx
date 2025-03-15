
import React, { useState } from 'react';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return setStatus('⚠️ No file selected');

    const formData = new FormData();
    formData.append('logFile', file);
    setLoading(true);

    try {
      const response = await fetch('/api/upload-logs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ Uploaded successfully! Job ID: ${data.jobId}`);
      } else {
        setStatus(`❌ Upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('❌ Upload failed: Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>📤 Upload Log File</h3>

      <label htmlFor="file-input" style={styles.uploadLabel}>
        {file ? file.name : 'Choose Log File'}
        <input
          id="file-input"
          type="file"
          accept=".log"
          onChange={handleChange}
          style={styles.fileInput}
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={loading ? styles.buttonDisabled : styles.button}
      >
        {loading ? 'Uploading...' : 'Upload Log File'}
      </button>

      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

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
  status: {
    marginTop: '1rem',
    color: '#4b5563',
    fontSize: '0.95rem',
    fontStyle: 'italic',
  },
};

// Inject global keyframes
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

export default FileUploader;
