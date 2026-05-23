import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setApps(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const statusColor = {
    pending: { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.4)', text: '#FCD34D' },
    shortlisted: { bg: 'rgba(34,197,94,0.2)', border: 'rgba(34,197,94,0.4)', text: '#86EFAC' },
    rejected: { bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.4)', text: '#FCA5A5' },
    approved: { bg: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.4)', text: '#C4B5FD' },
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
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer'
        }} onClick={() => navigate('/dashboard')}>
          🔗 NexRole
        </h1>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '8px 16px',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
        }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>
          📋 My Applications
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
          {apps.length} applications submitted
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>
            Loading...
          </div>
        ) : apps.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px', color: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            No applications yet.{' '}
            <span
              onClick={() => navigate('/jobs')}
              style={{ color: '#90CAF9', cursor: 'pointer', fontWeight: '600' }}
            >Browse jobs →</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {apps.map(app => {
              const s = statusColor[app.status] || statusColor.pending;
              return (
                <div key={app._id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '24px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>
                        {app.jobId?.title}
                      </h3>
                      <p style={{ margin: 0, color: '#90CAF9', fontSize: '14px' }}>
                        🏢 {app.jobId?.department}
                      </p>
                    </div>
                    <span style={{
                      background: s.bg, border: `1px solid ${s.border}`,
                      color: s.text, padding: '6px 14px',
                      borderRadius: '20px', fontSize: '12px',
                      fontWeight: '700', textTransform: 'uppercase'
                    }}>
                      {app.status}
                    </span>
                  </div>

                  {/* Score breakdown */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px', padding: '16px'
                  }}>
                    {[
                      { label: 'Skill Score', value: app.skillScore, color: '#2E75B6' },
                      { label: 'Exp Score', value: app.expScore, color: '#22C55E' },
                      { label: 'Performance', value: app.perfScore?.toFixed(0), color: '#F59E0B' },
                      { label: 'Final Score', value: app.finalScore, color: '#8B5CF6', bold: true },
                    ].map((s, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: s.bold ? '24px' : '20px',
                          fontWeight: '800', color: s.color
                        }}>
                          {s.value}%
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '4px'
                        }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p style={{
                    margin: '12px 0 0',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '12px'
                  }}>
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}