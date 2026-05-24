import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', department: '', description: '',
    requiredSkills: '', minExperience: '', deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/jobs', {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: Number(form.minExperience)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setTimeout(() => navigate('/hr/dashboard'), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
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

      <div style={{ padding: '40px 32px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>📝 Post New Job</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Create an internal job posting</p>

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
            ✅ Job posted! Redirecting...
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Job Title', key: 'title', placeholder: 'Senior React Developer', type: 'text' },
              { label: 'Department', key: 'department', placeholder: 'Engineering', type: 'text' },
              { label: 'Min Experience (years)', key: 'minExperience', placeholder: '3', type: 'number' },
              { label: 'Required Skills (comma separated)', key: 'requiredSkills', placeholder: 'React, Node.js, MongoDB', type: 'text' },
              { label: 'Application Deadline', key: 'deadline', placeholder: '', type: 'date' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '15px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Description</label>
              <textarea
                placeholder="Describe the role, responsibilities and requirements..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '15px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1F4E79, #2E75B6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⟳ Posting...' : '🚀 Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}