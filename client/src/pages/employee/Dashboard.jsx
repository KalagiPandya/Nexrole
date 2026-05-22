import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c29',
      fontFamily: "'Segoe UI', sans-serif",
      color: 'white'
    }}>
      {/* Navbar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          margin: 0, fontSize: '22px', fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff, #90CAF9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>🔗 NexRole</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            👋 Welcome, {user?.name}
          </span>
          <span style={{
            background: 'rgba(46,117,182,0.3)',
            border: '1px solid rgba(46,117,182,0.5)',
            color: '#90CAF9', padding: '4px 12px',
            borderRadius: '20px', fontSize: '12px', fontWeight: '600'
          }}>
            {user?.role?.toUpperCase()}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5', padding: '8px 16px',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 32px' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(31,78,121,0.6), rgba(46,117,182,0.4))',
          border: '1px solid rgba(46,117,182,0.3)',
          borderRadius: '20px', padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>
            Welcome back, {user?.name}! 👋
          </h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
            {user?.department} Department • {user?.role} Account
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', marginBottom: '32px'
        }}>
          {[
            { icon: '💼', label: 'Browse Jobs', value: 'View All', color: '#2E75B6', action: () => navigate('/jobs') },
            { icon: '📋', label: 'My Applications', value: 'View All', color: '#22C55E', action: () => navigate('/my-applications') },
            { icon: '👤', label: 'My Profile', value: 'Edit', color: '#F59E0B', action: () => navigate('/profile') },
            { icon: '🔔', label: 'Notifications', value: 'View', color: '#8B5CF6', action: () => {} },
          ].map((card, i) => (
            <div
              key={i}
              onClick={card.action}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${card.color}40`,
                borderRadius: '16px', padding: '24px',
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>{card.label}</div>
              <div style={{ fontSize: '13px', color: card.color, marginTop: '4px', fontWeight: '600' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Info */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.8)' }}>
            🚀 Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: '🔍 Browse Open Jobs', path: '/jobs' },
              { label: '📊 My Applications', path: '/my-applications' },
              { label: '✏️ Update Profile', path: '/profile' },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => navigate(btn.path)}
                style={{
                  background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
                  border: 'none', color: 'white',
                  padding: '10px 20px', borderRadius: '10px',
                  cursor: 'pointer', fontSize: '14px',
                  fontWeight: '600', transition: 'all 0.2s'
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}