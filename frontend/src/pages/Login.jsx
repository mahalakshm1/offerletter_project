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
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.card}>
        {/* Left accent bar */}
        <div style={s.cardAccent} />

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcon}>📄</div>
          <div>
            <div style={s.logoName}>OfferBuilder</div>
            <div style={s.logoSub}>HR Management Platform</div>
          </div>
        </div>

        <div style={s.divider} />

        <h2 style={s.title}>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        <p style={s.subtitle}>
          {isRegister ? 'Start managing offer letters today' : 'Sign in to your workspace to continue'}
        </p>

        {error && (
          <div style={s.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={submit} style={{ marginTop: '1.25rem' }}>
          {isRegister && (
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="John Doe" value={form.name} onChange={set('name')} required />
            </div>
          )}
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          {isRegister && (
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={form.role} onChange={set('role')}>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.75 : 1 }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={s.spinner} /> Please wait…
              </span>
            ) : isRegister ? '🚀 Create Account' : 'Sign In →'}
          </button>
        </form>

        <p style={s.toggle}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span style={s.toggleLink} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>

        <div style={s.footer}>
          <span style={s.footerDot} /> Secure · Encrypted · Enterprise-ready
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0c1a3a 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '1rem',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  blob1: {
    position: 'absolute', top: '-150px', right: '-150px',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-120px', left: '-120px',
    width: '420px', height: '420px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  blob3: {
    position: 'absolute', top: '40%', left: '30%',
    width: '300px', height: '300px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(24px)',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '420px',
    maxWidth: '100%',
    boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #3b82f6, #8b5cf6)',
    borderRadius: '20px 20px 0 0',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  logoIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.2rem',
    boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
    flexShrink: 0,
  },
  logoName: { fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 },
  logoSub: { fontSize: '0.68rem', color: '#94a3b8', fontWeight: '500', marginTop: '1px' },
  divider: { height: '1px', background: '#f1f5f9', margin: '0 0 1.25rem' },
  title: { fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem', letterSpacing: '-0.4px' },
  subtitle: { fontSize: '0.855rem', color: '#64748b', lineHeight: 1.5 },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    fontSize: '0.82rem',
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 500,
  },
  field: { marginBottom: '0.1rem' },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '0.35rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '9px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    background: '#fff',
    color: '#0f172a',
    outline: 'none',
    marginBottom: '0.85rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '0.8rem',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.925rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.25rem',
    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    transition: 'opacity 0.15s, transform 0.15s',
    fontFamily: 'inherit',
    letterSpacing: '-0.1px',
  },
  spinner: {
    width: '14px', height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  toggle: { marginTop: '1.25rem', fontSize: '0.855rem', textAlign: 'center', color: '#64748b' },
  toggleLink: { color: '#6366f1', cursor: 'pointer', fontWeight: '700' },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.72rem',
    color: '#cbd5e1',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
  },
  footerDot: {
    width: '6px', height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    display: 'inline-block',
  },
};
