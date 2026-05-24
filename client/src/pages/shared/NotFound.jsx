import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0c29',
      fontFamily: "'Segoe UI', sans-serif", color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '120px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{
          fontSize: '80px', fontWeight: '900', margin: '0',
          background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>404</h1>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', margin: '16px 0 32px' }}>
          This page doesn't exist in NexRole
        </p>
        <button
          onClick={() => navigate(user ? (user.role === 'hr' ? '/hr/dashboard' : '/dashboard') : '/login')}
          style={{
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            border: 'none', color: 'white', padding: '14px 32px',
            borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer'
          }}>
          ← Go Back Home
        </button>
      </div>
    </div>
  );
}