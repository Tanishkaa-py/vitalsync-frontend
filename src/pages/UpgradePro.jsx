import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5f0 50%, #f0f4f7 100%)', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', gap: 10 },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, cursor: 'pointer' },
  body: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  container: { maxWidth: 520, width: '100%' },
  tag: { display: 'inline-block', background: '#E1F5EE', color: '#085041', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, marginBottom: 16, letterSpacing: '0.06em' },
  heading: { fontSize: 32, fontWeight: 700, color: '#111211', lineHeight: 1.2, marginBottom: 12 },
  sub: { fontSize: 15, color: '#4a4f4b', marginBottom: 32, lineHeight: 1.6 },
  card: { background: '#fff', border: '2px solid #0F6E56', borderRadius: 20, padding: 32, marginBottom: 24, boxShadow: '0 8px 32px rgba(15,110,86,0.12)' },
  priceRow: { display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 24 },
  price: { fontSize: 48, fontWeight: 700, color: '#0F6E56', lineHeight: 1 },
  priceSub: { fontSize: 14, color: '#4a4f4b', paddingBottom: 8 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 28px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14, color: '#111211', borderBottom: '1px solid #f4f6f4' },
  featureIcon: { width: 22, height: 22, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
  upgradeBtn: { width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', marginBottom: 12 },
  testNote: { background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' },
  testNoteText: { fontSize: 12, color: '#92400E', lineHeight: 1.5 },
  testCard: { background: '#f4f6f4', borderRadius: 10, padding: '14px 16px', marginTop: 16 },
  testCardTitle: { fontSize: 12, fontWeight: 600, color: '#111211', marginBottom: 8 },
  testCardRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4a4f4b', marginBottom: 4 },
  error: { background: '#FEE2E2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#991B1B', marginBottom: 16 },
};

export default function UpgradePro() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/payments/create-checkout-session');
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    'Unlimited appointment bookings',
    'Priority doctor access',
    'Advanced health analytics dashboard',
    'Medical history export (PDF)',
    'Video consultation support',
    'Family member profiles (up to 4)',
    'Priority customer support',
    '30-day money-back guarantee',
  ];

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync</span>
        <div style={s.navRight}>
          <button style={s.backBtn} onClick={() => navigate('/patient/dashboard')}>← Dashboard</button>
          <button style={s.backBtn} onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.body}>
        <div style={s.container}>
          <span style={s.tag}>⭐ VITALSYNC PRO</span>
          <h1 style={s.heading}>Upgrade to Pro<br />and take control of<br />your health.</h1>
          <p style={s.sub}>Everything you need to manage your healthcare in one place. One-time payment, lifetime access.</p>

          {error && <div style={s.error}>⚠️ {error}</div>}

          <div style={s.card}>
            <div style={s.priceRow}>
              <span style={s.price}>₹499</span>
              <span style={s.priceSub}>one-time payment</span>
            </div>
            <ul style={s.featureList}>
              {features.map(f => (
                <li key={f} style={s.featureItem}>
                  <div style={s.featureIcon}>✓</div>
                  {f}
                </li>
              ))}
            </ul>
            <button
              style={{ ...s.upgradeBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? 'Redirecting to Stripe...' : '🔒 Upgrade to Pro — ₹499'}
            </button>
            <div style={s.testNote}>
              <span style={{ fontSize: 16 }}>🧪</span>
              <div style={s.testNoteText}>
                <strong>Test Mode Active.</strong> Use card number <strong>4242 4242 4242 4242</strong>, any future date, any 3-digit CVC, and any 5-digit ZIP to complete a test payment.
              </div>
            </div>
            <div style={s.testCard}>
              <div style={s.testCardTitle}>Test Card Details</div>
              <div style={s.testCardRow}><span>Card Number</span><strong>4242 4242 4242 4242</strong></div>
              <div style={s.testCardRow}><span>Expiry</span><strong>Any future date (e.g. 12/29)</strong></div>
              <div style={s.testCardRow}><span>CVC</span><strong>Any 3 digits (e.g. 123)</strong></div>
              <div style={s.testCardRow}><span>ZIP</span><strong>Any 5 digits (e.g. 12345)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
