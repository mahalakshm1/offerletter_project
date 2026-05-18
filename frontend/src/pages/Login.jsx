import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.post('/api/auth/register', form);
        setIsRegister(false);
        setForm({ name: '', email: '', password: '', role: 'hr' });
      } else {
        const { data } = await api.post('/api/auth/login', { email: form.email, password: form.password });
        login(data.token, data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>📄</div>
          <span style={styles.logoText}>OfferBuilder</span>
        </div>

        <h2 style={styles.title}>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        <p style={styles.subtitle}>{isRegister ? 'Start managing offer letters today' : 'Sign in to your workspace'}</p>

        {error && <div className="error">⚠️ {error}</div>}

        <form onSubmit={submit}>
          {isRegister && (
            <div>
              <label style={styles.label}>Full Name</label>
              <input placeholder="John Doe" value={form.name} onChange={set('name')} required />
            </div>
          )}
          <div>
            <label style={styles.label}>Email Address</label>
            <input type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          {isRegister && (
            <div>
              <label style={styles.label}>Role</label>
              <select value={form.role} onChange={set('role')}>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? '⏳ Please wait…' : isRegister ? '🚀 Create Account' : '→ Sign In'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span
            style={styles.toggleLink}
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2044 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
  },
  blob1: {
    position: 'absolute', top: '-120px', right: '-120px',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-100px', left: '-100px',
    width: '350px', height: '350px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '400px',
    maxWidth: '100%',
    boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    marginBottom: '1.75rem',
  },
  logoIcon: {
    width: '38px', height: '38px',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem',
    boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
  },
  logoText: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' },
  title: { fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.3rem' },
  subtitle: { fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' },
  label: {
    display: 'block', fontSize: '0.78rem', fontWeight: '600',
    color: '#475569', marginBottom: '0.3rem',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.25rem',
    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
    transition: 'opacity 0.18s',
    fontFamily: 'inherit',
  },
  toggle: { marginTop: '1.25rem', fontSize: '0.85rem', textAlign: 'center', color: '#64748b' },
  toggleLink: { color: '#6366f1', cursor: 'pointer', fontWeight: '600' },
};
