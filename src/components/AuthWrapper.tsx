// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';

// interface AuthWrapperProps {
//   children: React.ReactNode;
// }

// export default function AuthWrapper({ children }: AuthWrapperProps) {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     fetchUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   if (!user) {
//     return (
//       <div className="p-8">
//         <h2 className="text-xl mb-2">🔒 Please log in</h2>
//         <button
//           onClick={() =>
//             supabase.auth.signInWithOAuth({
//               provider: 'github',
//               options: {
//                 redirectTo: 'http://localhost:3000/dashboard', 
//               },
//             })
//           }
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           Login with GitHub
//         </button>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
// components/AuthWrapper.tsx
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push('/login');
  }, [session]);

  return (
    <>
      {session ? (
        children
      ) : (
        <div style={styles.card}>
          <h2 style={styles.text}>🔒 Redirecting to login...</h2>
        </div>
      )}
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    animation: 'fadeIn 0.6s ease-in-out',
    background: '#ffffff',
    border: '2px solid #e0e7ff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    maxWidth: '500px',
    margin: '3rem auto',
    textAlign: 'center',
  },
  text: {
    fontSize: '1.25rem',
    color: '#4f46e5',
    fontWeight: 600,
  },
};

// Inject fadeIn animation
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
