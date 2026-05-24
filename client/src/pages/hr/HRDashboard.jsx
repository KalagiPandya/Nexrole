import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function HRDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      {/* Navbar */}
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>👋 {user?.name}</span>
          <span style={{ background: 'rgba(245,158,11,0.3)', border: '1px solid rgba(245,158,11,0.5)', color: '#FCD34D', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>HR MANAGER</span>
          <button onClick={() => navigate('/hr/post-job')} style={{ background: 'linear-gradient(135deg, #1F4E79, #2E75B6)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>+ Post Job</button>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Logout</button>
        </div>
      </div>

      <div style={{ padding: '40px 32px' }}>
        {/* Welcome */}
        <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(31,78,121,0.4))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>Welcome, {user?.name}! 🎯</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>HR Manager Dashboard — Manage jobs and promotions</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { icon: '💼', label: 'Open Jobs', value: jobs.length, color: '#2E75B6', action: () => {} },
            { icon: '📝', label: 'Post New Job', value: 'Create', color: '#22C55E', action: () => navigate('/hr/post-job') },
            { icon: '👥', label: 'View Applicants', value: 'Review', color: '#F59E0B', action: () => navigate('/hr/applicants') },
            { icon: '🔗', label: 'Vacancy Chain', value: 'Analyze', color: '#8B5CF6', action: () => navigate('/hr/promotions') },
          ].map((card, i) => (
            <div key={i} onClick={card.action} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${card.color}40`, borderRadius: '16px', padding: '24px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>{card.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: card.color, marginTop: '4px' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Job List */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px' }}>📋 Active Job Postings</h3>
          {loading ? <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</div> :
            jobs.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '40px' }}>No jobs posted yet. <span onClick={() => navigate('/hr/post-job')} style={{ color: '#90CAF9', cursor: 'pointer' }}>Post one now →</span></div> :
            jobs.map(job => (
              <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{job.title}</div>
                  <div style={{ color: '#90CAF9', fontSize: '13px', marginTop: '4px' }}>{job.department} • {job.minExperience}+ years</div>
                </div>
                <button onClick={() => navigate(`/hr/applicants/${job._id}`)} style={{ background: 'linear-gradient(135deg, #1F4E79, #2E75B6)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  View Applicants →
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}