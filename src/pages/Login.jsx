import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5f0 50%, #f0f4f7 100%)', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 16, fontWeight: 500, letterSpacing: '0.02em' },
  navSub: { marginLeft: 'auto', color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  body: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(15,110,86,0.08), 0 1px 4px rgba(0,0,0,0.04)' },
  heading: { fontSize: 22, fontWeight: 600, color: '#111211', marginBottom: 4 },
  sub: { fontSize: 13, color: '#4a4f4b', marginBottom: 24 },
  roleLabel: { fontSize: 12, fontWeight: 500, color: '#4a4f4b', marginBottom: 10 },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 },
  roleCard: (active) => ({
    border: active ? '1.5px solid #0F6E56' : '1px solid #e2e6e2',
    background: active ? '#E1F5EE' : '#fff',
    borderRadius: 10, padding: '12px 10px', cursor: 'pointer',
    transition: 'all 0.15s ease', textAlign: 'left',
  }),
  roleIcon: { fontSize: 18, marginBottom: 6 },
  roleName: (active) => ({ fontSize: 13, fontWeight: 500, color: active ? '#085041' : '#111211' }),
  roleDesc: { fontSize: 11, color: '#8a8f8b', marginTop: 2 },
  fieldWrap: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 500, color: '#4a4f4b', marginBottom: 6 },
  input: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#111211', outline: 'none', transition: 'border-color 0.15s', background: '#fafbfa' },
  btn: { width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4, transition: 'background 0.15s' },
  btnDisabled: { opacity: 0.7, cursor: 'not-allowed' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#dc2626', marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8a8f8b' },
  link: { color: '#0F6E56', textDecoration: 'none', fontWeight: 500 },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      // Redirect based on role
      navigate(data.data.user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navDot} />
        <span style={styles.navLogo}>VitalSync</span>
        <span style={styles.navSub}>Healthcare Platform</span>
      </nav>
      <div style={styles.body}>
        <div style={styles.card}>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your VitalSync account</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <p style={styles.roleLabel}>Select your role</p>
          <div style={styles.roleRow}>
            {[
              { value: 'doctor', icon: '🩺', label: 'Doctor', desc: 'Manage patients & schedule' },
              { value: 'patient', icon: '👤', label: 'Patient', desc: 'Book appointments & records' },
            ].map((r) => (
              <div key={r.value} style={styles.roleCard(role === r.value)} onClick={() => setRole(r.value)}>
                <div style={styles.roleIcon}>{r.icon}</div>
                <div style={styles.roleName(role === r.value)}>{r.label}</div>
                <div style={styles.roleDesc}>{r.desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" placeholder="doctor@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to VitalSync'}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account? <Link to="/register" style={styles.link}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
