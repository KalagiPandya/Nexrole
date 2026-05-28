import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ApplicantsOverview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate('/hr/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>👥 All Job Applications</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Select a job to view its applicants</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {jobs.map(job => (
              <div key={job._id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(46,117,182,0.3)', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,117,182,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                onClick={() => navigate(`/hr/applicants/${job._id}`)}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700' }}>{job.title}</h3>
                <p style={{ color: '#90CAF9', margin: '0 0 12px', fontSize: '14px' }}>🏢 {job.department}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {job.requiredSkills?.slice(0, 3).map((s, i) => (
                    <span key={i} style={{ background: 'rgba(46,117,182,0.2)', color: '#90CAF9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>⏱️ {job.minExperience}+ years</span>
                  <span style={{ color: '#2E75B6', fontSize: '13px', fontWeight: '600' }}>View Applicants →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}