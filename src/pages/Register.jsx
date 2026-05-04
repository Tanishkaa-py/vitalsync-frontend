import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5f0 50%, #f0f4f7 100%)', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 16, fontWeight: 500 },
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
  input: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#111211', outline: 'none', background: '#fafbfa' },
  btn: { width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4, transition: 'background 0.15s' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#dc2626', marginBottom: 16 },
  success: { background: '#E1F5EE', border: '1px solid #5DCAA5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#085041', marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8a8f8b' },
  link: { color: '#0F6E56', textDecoration: 'none', fontWeight: 500 },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'patient' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (role) => setForm({ ...form, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.role);
      navigate(data.user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 style={styles.heading}>Create your account</h1>
          <p style={styles.sub}>Join VitalSync — it only takes a minute</p>

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <p style={styles.roleLabel}>I am a...</p>
          <div style={styles.roleRow}>
            {[
              { value: 'doctor', icon: '🩺', label: 'Doctor', desc: 'Manage patients & schedule' },
              { value: 'patient', icon: '👤', label: 'Patient', desc: 'Book appointments & records' },
            ].map((r) => (
              <div key={r.value} style={styles.roleCard(form.role === r.value)} onClick={() => setRole(r.value)}>
                <div style={styles.roleIcon}>{r.icon}</div>
                <div style={styles.roleName(form.role === r.value)}>{r.label}</div>
                <div style={styles.roleDesc}>{r.desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} name="name" type="text" placeholder="Dr. Sanjay Mehra" value={form.name} onChange={handleChange} required />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} name="email" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={handleChange} required />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Confirm password</label>
              <input style={styles.input} name="confirmPassword" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create VitalSync account'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
