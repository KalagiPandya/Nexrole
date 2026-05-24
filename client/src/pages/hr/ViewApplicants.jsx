import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:5000/api/applications/${jobId}/applicants`, { headers: { Authorization: `Bearer ${token}` } })
    ]).then(([jobRes, appRes]) => {
      setJob(jobRes.data);
      setApplicants(appRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, jobId]);

  const getRiskColor = (score) => {
    if (score >= 70) return { color: '#86EFAC', bg: 'rgba(34,197,94,0.2)', label: 'HIGH MATCH' };
    if (score >= 40) return { color: '#FCD34D', bg: 'rgba(245,158,11,0.2)', label: 'MEDIUM' };
    return { color: '#FCA5A5', bg: 'rgba(239,68,68,0.2)', label: 'LOW MATCH' };
  };

  const handleVacancyChain = async (appId) => {
    navigate(`/hr/impact/${appId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate('/hr/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: '800' }}>👥 Applicants</h2>
        {job && <p style={{ color: '#90CAF9', marginBottom: '8px', fontSize: '16px' }}>💼 {job.title} — {job.department}</p>}
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>{applicants.length} applicants — ranked by score</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            No applicants yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applicants.map((app, index) => {
              const risk = getRiskColor(app.finalScore);
              return (
                <div key={app._id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, #1F4E79, #2E75B6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>{app.userId?.name}</h3>
                        <p style={{ margin: 0, color: '#90CAF9', fontSize: '13px' }}>{app.userId?.email} • {app.userId?.department}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ background: risk.bg, color: risk.color, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{risk.label}</span>
                      <span style={{ background: 'rgba(139,92,246,0.2)', color: '#C4B5FD', padding: '6px 14px', borderRadius: '20px', fontSize: '16px', fontWeight: '800' }}>{app.finalScore}%</span>
                    </div>
                  </div>

                  {/* Score bars */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    {[
                      { label: 'Skills', value: app.skillScore, color: '#2E75B6' },
                      { label: 'Experience', value: app.expScore, color: '#22C55E' },
                      { label: 'Performance', value: app.perfScore?.toFixed(0), color: '#F59E0B' },
                      { label: 'Final', value: app.finalScore, color: '#8B5CF6' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}%</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {app.userId?.skills?.map((skill, i) => {
                      const isMatch = job?.requiredSkills?.includes(skill);
                      return (
                        <span key={i} style={{ background: isMatch ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${isMatch ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.15)'}`, color: isMatch ? '#86EFAC' : 'rgba(255,255,255,0.6)', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                          {isMatch ? '✓' : ''} {skill}
                        </span>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleVacancyChain(app._id)}
                      style={{ background: 'linear-gradient(135deg, #4A148C, #7B1FA2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                      🔗 Vacancy Chain Analysis
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}