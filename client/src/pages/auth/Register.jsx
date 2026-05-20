import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          border-color: #2E75B6 !important;
          box-shadow: 0 0 0 3px rgba(46,117,182,0.2) !important;
        }
        .reg-btn:hover { transform: translateY(-2px) !important; }
      `}</style>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px', padding: '48px',
        width: '100%', maxWidth: '420px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        animation: 'fadeInUp 0.6s ease-out',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '28px' }}>🔗</span>
          </div>
          <h1 style={{
            color: 'white', fontSize: '28px',
            fontWeight: '800', margin: '0',
            background: 'linear-gradient(135deg, #ffffff, #90CAF9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Join NexRole
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', fontSize: '13px' }}>
            Create your account today
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5', padding: '12px 16px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px'
          }}>⚠️ {error}</div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#86EFAC', padding: '12px 16px',
            borderRadius: '10px', marginBottom: '20px',
            fontSize: '14px', textAlign: 'center'
          }}>
            ✅ Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Kalagi Pandya' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@company.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Department', key: 'department', type: 'text', placeholder: 'Engineering' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', marginBottom: '8px',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: '600', fontSize: '13px',
                letterSpacing: '0.5px', textTransform: 'uppercase'
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px', fontSize: '15px',
                  color: 'white', outline: 'none',
                  boxSizing: 'border-box', transition: 'all 0.2s'
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="reg-btn"
            style={{
              width: '100%', padding: '15px',
              background: loading
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #1F4E79, #2E75B6)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontSize: '16px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: '8px'
            }}
          >
            {loading ? '⟳ Creating...' : 'Create Account →'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: 'rgba(255,255,255,0.4)', fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#90CAF9', fontWeight: '600', textDecoration: 'none'
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}