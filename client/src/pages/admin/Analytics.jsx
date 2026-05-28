import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([u, j]) => { setUsers(u.data); setJobs(j.data); });
  }, [token]);

  const deptData = users.reduce((acc, u) => {
    if (u.department) {
      const found = acc.find(a => a.name === u.department);
      if (found) found.count++;
      else acc.push({ name: u.department, count: 1 });
    }
    return acc;
  }, []);

  const roleData = [
    { name: 'Employees', value: users.filter(u => u.role === 'employee').length, color: '#2E75B6' },
    { name: 'HR Managers', value: users.filter(u => u.role === 'hr').length, color: '#F59E0B' },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#8B5CF6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>📊 System Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Real-time platform statistics</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Users by Department */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px' }}>👥 Users by Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
                <Bar dataKey="count" fill="#2E75B6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Role Distribution */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px' }}>🎭 Role Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {roleData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: '#2E75B6' },
            { label: 'Open Jobs', value: jobs.length, icon: '💼', color: '#22C55E' },
            { label: 'Departments', value: deptData.length, icon: '🏢', color: '#F59E0B' },
            { label: 'HR Managers', value: users.filter(u => u.role === 'hr').length, icon: '🎯', color: '#8B5CF6' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${s.color}40`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}