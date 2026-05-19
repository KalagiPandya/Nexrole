import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#1F4E79', fontSize: '32px', fontWeight: 'bold', margin: '0' }}>
            NexRole
          </h1>
          <p style={{ color: '#666', margin: '8px 0 0', fontSize: '14px' }}>
            Create your account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FFEBEE', color: '#C62828',
            padding: '12px 16px', borderRadius: '8px',
            marginBottom: '20px', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Kalagi Pandya' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@company.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
            { label: 'Department', key: 'department', type: 'text', placeholder: 'Engineering' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', marginBottom: '6px',
                color: '#333', fontWeight: '600', fontSize: '14px'
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
                  width: '100%', padding: '12px 16px',
                  border: '2px solid #E0E0E0', borderRadius: '8px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#90A4AE' : '#1F4E79',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '16px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          color: '#666', fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1F4E79', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}