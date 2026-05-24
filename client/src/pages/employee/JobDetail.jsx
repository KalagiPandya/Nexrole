import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const [job, setJob] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [scorePreview, setScorePreview] = useState(null);
  const { token } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
    ]).then(([jobRes, userRes]) => {
      setJob(jobRes.data);
      setUserProfile(userRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/applications/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(true);
      setScorePreview(res.data.scoreBreakdown);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>
  );

  const userSkillSet = new Set(userProfile?.skills?.map(s => s.toLowerCase()) || []);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate('/jobs')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back to Jobs</button>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Job Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(31,78,121,0.6), rgba(46,117,182,0.4))', border: '1px solid rgba(46,117,182,0.3)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>{job?.title}</h2>
              <p style={{ color: '#90CAF9', margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>🏢 {job?.department}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.6' }}>{job?.description}</p>
            </div>
            <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86EFAC', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>OPEN</span>
          </div>
          <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            ⏱️ Minimum {job?.minExperience} years experience required
          </div>
        </div>

        {/* Skill Match Visual */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>🎯 Your Skill Match</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {job?.requiredSkills?.map((skill, i) => {
              const has = userSkillSet.has(skill.toLowerCase());
              return (
                <span key={i} style={{ background: has ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${has ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, color: has ? '#86EFAC' : '#FCA5A5', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
                  {has ? '✓' : '✗'} {skill}
                </span>
              );
            })}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '12px' }}>
            Green = you have it • Red = you don't have it yet
          </p>
        </div>

        {/* Score Preview after applying */}
        {scorePreview && (
          <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#C4B5FD' }}>📊 Your Score Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'Skill Match', value: scorePreview.skillScore, color: '#2E75B6' },
                { label: 'Experience', value: scorePreview.expScore, color: '#22C55E' },
                { label: 'Performance', value: scorePreview.perfScore, color: '#F59E0B' },
                { label: 'Final Score', value: scorePreview.finalScore, color: '#8B5CF6' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}%</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        {applied ? (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC', padding: '20px', borderRadius: '16px', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}>
            🎉 Application Submitted Successfully!
            <button onClick={() => navigate('/my-applications')} style={{ display: 'block', margin: '12px auto 0', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86EFAC', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              View My Applications →
            </button>
          </div>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            style={{ width: '100%', padding: '18px', background: applying ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1F4E79, #2E75B6)', border: 'none', color: 'white', borderRadius: '14px', fontSize: '18px', fontWeight: '800', cursor: applying ? 'not-allowed' : 'pointer', letterSpacing: '0.5px' }}>
            {applying ? '⟳ Submitting...' : '🚀 Apply for This Position'}
          </button>
        )}
      </div>
    </div>
  );
}