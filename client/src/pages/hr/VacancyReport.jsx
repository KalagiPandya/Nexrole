import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function VacancyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const { token } = useAuth();
  const { appId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/promotions/impact/${appId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setReport(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token, appId]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await axios.post(`http://localhost:5000/api/promotions/approve/${appId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApproved(true);
    } catch (err) {
      alert('Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const riskStyle = {
    LOW: { color: '#86EFAC', bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', icon: '🟢' },
    MEDIUM: { color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', icon: '🟡' },
    HIGH: { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', icon: '🔴' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔗 NexRole</h1>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>🔗 Vacancy Chain Analysis</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Organizational impact report before approving promotion</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
            Running Graph + DFS Analysis...
          </div>
        ) : !report ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.5)' }}>Report not found</div>
        ) : (
          <>
            {/* Risk Banner */}
            {(() => {
              const rs = riskStyle[report.riskLevel] || riskStyle.HIGH;
              return (
                <div style={{ background: rs.bg, border: `2px solid ${rs.border}`, borderRadius: '20px', padding: '32px', marginBottom: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{rs.icon}</div>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: rs.color, marginBottom: '8px' }}>
                    {report.riskLevel} RISK
                  </div>
                  <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>{report.recommendation}</div>
                </div>
              );
            })()}

            {/* Chain Analysis Steps */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 20px', color: '#90CAF9' }}>📊 Chain Analysis</h3>
              {Object.values(report.chainAnalysis || {}).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #1F4E79, #2E75B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', flex: 1, fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* Promoted Employee */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(46,117,182,0.1)', border: '1px solid rgba(46,117,182,0.3)', borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 12px', color: '#90CAF9' }}>👤 Being Promoted</h4>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>{report.promotedEmployee?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{report.promotedEmployee?.department}</div>
                <div style={{ color: '#90CAF9', fontSize: '13px', marginTop: '8px' }}>→ {report.targetRole}</div>
              </div>

              <div style={{ background: report.bestReplacement ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${report.bestReplacement ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 12px', color: report.bestReplacement ? '#86EFAC' : '#FCA5A5' }}>🎯 Best Replacement</h4>
                {report.bestReplacement ? (
                  <>
                    <div style={{ fontWeight: '700', fontSize: '18px' }}>{report.bestReplacement.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{report.bestReplacement.department}</div>
                    <div style={{ color: '#86EFAC', fontSize: '20px', fontWeight: '800', marginTop: '8px' }}>{report.bestReplacement.finalScore}% match</div>
                  </>
                ) : (
                  <div style={{ color: '#FCA5A5', fontSize: '15px' }}>No suitable replacement found</div>
                )}
              </div>
            </div>

            {/* All Candidates */}
            {report.allCandidates?.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px' }}>👥 All Candidates Evaluated</h3>
                {report.allCandidates.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>#{i + 1} {c.name}</span>
                    <span style={{ color: c.finalScore >= 70 ? '#86EFAC' : c.finalScore >= 40 ? '#FCD34D' : '#FCA5A5', fontWeight: '800' }}>{c.finalScore}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Approve Button */}
            {approved ? (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC', padding: '20px', borderRadius: '16px', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}>
                🎉 Promotion Approved Successfully!
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  style={{ flex: 1, padding: '16px', background: 'linear-gradient(135deg, #1E6B3C, #22C55E)', border: 'none', color: 'white', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: approving ? 'not-allowed' : 'pointer' }}>
                  {approving ? '⟳ Approving...' : '✅ Approve Promotion'}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  style={{ flex: 1, padding: '16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                  ❌ Reject
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}