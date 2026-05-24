import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Promotions() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setJobs(res.data));
  }, [token]);

  const loadApplicants = async (jobId) => {
    setSelectedJob(jobId);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(res.data);
    } catch (err) {
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate('/hr/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>🔗 Promotion Management</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Select a job to run vacancy chain analysis</p>

        {/* Job selector */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase' }}>Select Job Position</label>
          <select
            value={selectedJob}
            onChange={e => loadApplicants(e.target.value)}
            style={{ width: '100%', maxWidth: '500px', padding: '14px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '15px', color: 'white', outline: 'none' }}
          >
            <option value="" style={{ background: '#1a1a2e' }}>-- Select a job --</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id} style={{ background: '#1a1a2e' }}>{job.title} — {job.department}</option>
            ))}
          </select>
        </div>

        {/* Applicants list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>Loading applicants...</div>
        ) : applicants.length > 0 ? (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Candidates — Click to run Vacancy Chain Analysis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {applicants.map((app, i) => (
                <div key={app._id} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px', padding: '20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px' }}>#{i+1} {app.userId?.name}</div>
                    <div style={{ color: '#90CAF9', fontSize: '13px', marginTop: '4px' }}>{app.userId?.department} • Score: {app.finalScore}%</div>
                  </div>
                  <button
                    onClick={() => navigate(`/hr/impact/${app._id}`)}
                    style={{ background: 'linear-gradient(135deg, #4A148C, #7B1FA2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                    🔗 Run Analysis →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : selectedJob ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>No applicants for this job yet</div>
        ) : null}
      </div>
    </div>
  );
}