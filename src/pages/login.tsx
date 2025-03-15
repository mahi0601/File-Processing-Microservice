// pages/login.tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function LoginPage() {
  const supabase = useSupabaseClient();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. See console for details.');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>🔐 Login to Access Dashboard</h2>
      <button onClick={handleLogin} style={styles.button}>
        Login with GitHub
      </button>
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
    padding: '3rem 2rem',
    maxWidth: '500px',
    margin: '5rem auto',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#4f46e5',
    fontWeight: 600,
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
};

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
  `;
  document.head.appendChild(style);
}
