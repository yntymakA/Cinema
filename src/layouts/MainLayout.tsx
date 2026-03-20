import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export const MainLayout: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        backgroundColor: 'rgba(15, 17, 21, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>🍿</span> CinemaBooker
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAdmin && (
            <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>
              Admin Portal
            </Link>
          )}

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.email}</span>
              <button 
                onClick={handleLogout}
                className="btn-danger"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        borderTop: '1px solid var(--glass-border)',
        marginTop: 'auto',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem' 
      }}>
        © {new Date().getFullYear()} CinemaBooker — Built with React & Firebase
      </footer>
    </div>
  );
};
