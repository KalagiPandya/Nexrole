import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'hr') return navigate('/hr/dashboard');
      if (res.data.user.role === 'admin') return navigate('/admin');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        borderRadius: '50%', background: 'rgba(46, 117, 182, 0.15)',
        top: '-100px', left: '-100px', animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        borderRadius: '50%', background: 'rgba(31, 78, 121, 0.2)',
        bottom: '-80px', right: '-80px', animation: 'pulse 6s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        input:focus {
          border-color: #2E75B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 117, 182, 0.2) !important;
        }
        .login-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(46, 117, 182, 0.5) !important;
        }
        .login-btn:active {
          transform: translateY(0) !important;
        }
      `}</style>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        animation: 'fadeInUp 0.6s ease-out',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px', height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(46,117,182,0.4)'
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
            NexRole
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', fontSize: '13px' }}>
            Vacancy Chain Intelligence Platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#FCA5A5',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@company.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' }
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '20px' }}>
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
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{
              width: '100%', padding: '15px',
              background: loading
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg, #1F4E79, #2E75B6)',
              color: 'white', border: 'none',
              borderRadius: '12px', fontSize: '16px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '8px',
              letterSpacing: '0.5px'
            }}
          >
            {loading ? '⟳ Signing in...' : 'Sign In to NexRole →'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: 'rgba(255,255,255,0.4)', fontSize: '14px'
        }}>
          New to NexRole?{' '}
          <Link to="/register" style={{
            color: '#90CAF9', fontWeight: '600',
            textDecoration: 'none'
          }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}