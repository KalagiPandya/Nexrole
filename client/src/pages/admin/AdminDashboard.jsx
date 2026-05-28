import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([usersRes, jobsRes]) => {
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleColor = {
    employee: { bg: 'rgba(46,117,182,0.2)', color: '#90CAF9' },
    hr: { bg: 'rgba(245,158,11,0.2)', color: '#FCD34D' },
    admin: { bg: 'rgba(139,92,246,0.2)', color: '#C4B5FD' },
  };

  const stats = [
    { icon: '👥', label: 'Total Users', value: users.length, color: '#2E75B6' },
    { icon: '💼', label: 'Open Jobs', value: jobs.length, color: '#22C55E' },
    { icon: '🏢', label: 'HR Managers', value: users.filter(u => u.role === 'hr').length, color: '#F59E0B' },
    { icon: '👑', label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#8B5CF6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      {/* Navbar */}
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>👑 {user?.name}</span>
          <span style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid rgba(139,92,246,0.5)', color: '#C4B5FD', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>ADMIN</span>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        {/* Welcome */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(31,78,121,0.4))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>Admin Control Panel 👑</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>Manage all users, roles and system settings</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${s.color}40`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

{/* Analytics Button */}
<div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
  <button
    onClick={() => navigate('/admin/analytics')}
    style={{
      background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
      border: 'none',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600'
    }}
  >
    📊 View Analytics →
  </button>
</div>

        {/* User Management */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '18px' }}>👥 User Management</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>Loading users...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Name', 'Email', 'Department', 'Role', 'Change Role'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const rc = roleColor[u.role] || roleColor.employee;
                    return (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.name}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{u.email}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{u.department || '-'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: rc.bg, color: rc.color, padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u._id, e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 10px', color: 'white', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
                          >
                            <option value="employee" style={{ background: '#1a1a2e' }}>Employee</option>
                            <option value="hr" style={{ background: '#1a1a2e' }}>HR Manager</option>
                            <option value="admin" style={{ background: '#1a1a2e' }}>Admin</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}