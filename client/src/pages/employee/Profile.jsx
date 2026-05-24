import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [department, setDepartment] = useState('');
  const [certifications, setCertifications] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile(res.data);
      setSkills(res.data.skills?.join(', ') || '');
      setExperience(res.data.experience || '');
      setDepartment(res.data.department || '');
      setCertifications(res.data.certifications?.join(', ') || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/users/profile', {
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        experience: Number(experience),
        department,
        certifications: certifications.split(',').map(c => c.trim()).filter(c => c)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f0c29', fontFamily: "'Segoe UI', sans-serif", color: 'white' }}>
      {/* Navbar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #90CAF9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>🔗 NexRole</h1>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>← Back</button>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '800' }}>👤 My Profile</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Update your skills and experience</p>

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
            ✅ Profile updated successfully!
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
          {/* Read only info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Full Name', value: profile?.name },
              { label: 'Email', value: profile?.email },
              { label: 'Role', value: profile?.role?.toUpperCase() },
              { label: 'Performance Rating', value: `${profile?.performanceRating}/5` },
            ].map((item, i) => (
              <div key={i}>
                <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Editable fields */}
          {[
            { label: 'Department', value: department, set: setDepartment, placeholder: 'Engineering', type: 'text' },
            { label: 'Years of Experience', value: experience, set: setExperience, placeholder: '2', type: 'number' },
            { label: 'Skills (comma separated)', value: skills, set: setSkills, placeholder: 'React, Node.js, MongoDB', type: 'text' },
            { label: 'Certifications (comma separated)', value: certifications, set: setCertifications, placeholder: 'AWS Cloud, React Certified', type: 'text' },
          ].map((field, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={e => field.set(e.target.value)}
                placeholder={field.placeholder}
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '15px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width: '100%', padding: '15px', background: saving ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1F4E79, #2E75B6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? '⟳ Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}