import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const notifications = [
    { id: 1, message: 'Your application for Senior React Developer is under review', time: 'Just now', read: false, icon: '📋' },
    { id: 2, message: 'New job posted: Full Stack Developer in Engineering', time: '2 hours ago', read: false, icon: '💼' },
    { id: 3, message: 'Your profile was updated successfully', time: '1 day ago', read: true, icon: '✅' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate(user?.role === 'hr' ? '/hr/dashboard' : '/dashboard')}
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>🔔 Notifications</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>{notifications.filter(n => !n.read).length} unread</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(46,117,182,0.1)',
              border: `1px solid ${n.read ? 'rgba(255,255,255,0.06)' : 'rgba(46,117,182,0.3)'}`,
              borderRadius: '14px', padding: '20px',
              display: 'flex', gap: '16px', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '24px' }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 6px', fontSize: '15px', color: n.read ? 'rgba(255,255,255,0.6)' : 'white', fontWeight: n.read ? '400' : '600' }}>{n.message}</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{n.time}</span>
              </div>
              {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E75B6', flexShrink: 0, marginTop: '6px' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}