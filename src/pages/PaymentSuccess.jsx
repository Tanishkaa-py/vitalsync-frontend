import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7f4, #e8f5f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(15,110,86,0.12)' },
  icon: { width: 80, height: 80, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' },
  heading: { fontSize: 26, fontWeight: 700, color: '#111211', marginBottom: 12 },
  sub: { fontSize: 15, color: '#4a4f4b', lineHeight: 1.6, marginBottom: 8 },
  email: { fontSize: 14, color: '#0F6E56', fontWeight: 500, marginBottom: 32 },
  proTag: { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0F6E56', color: '#fff', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 600, marginBottom: 32 },
  perks: { background: '#f4f6f4', borderRadius: 12, padding: '16px 20px', marginBottom: 32, textAlign: 'left' },
  perkTitle: { fontSize: 12, fontWeight: 600, color: '#4a4f4b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' },
  perkItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#111211', marginBottom: 6 },
  dashBtn: { width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  loading: { textAlign: 'center', color: '#4a4f4b', padding: 40 },
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { navigate('/patient/dashboard'); return; }

    const verify = async () => {
      try {
        const { data } = await api.get(`/api/payments/verify/${sessionId}`);
        setPaymentData(data);
      } catch (err) {
        console.error('Verification error:', err);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, []);

  if (verifying) {
    return (
      <div style={s.page}>
        <div style={s.loading}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🎉</div>
        <h1 style={s.heading}>Payment Successful!</h1>
        <p style={s.sub}>Welcome to VitalSync Pro. Your account has been upgraded.</p>
        {paymentData?.customerEmail && (
          <p style={s.email}>Receipt sent to {paymentData.customerEmail}</p>
        )}
        <div style={s.proTag}>
          ⭐ VitalSync Pro — Active
        </div>
        <div style={s.perks}>
          <div style={s.perkTitle}>Your Pro Benefits</div>
          {[
            'Unlimited appointment bookings',
            'Priority doctor access',
            'Advanced health analytics',
            'Medical history PDF export',
            'Family member profiles',
          ].map(p => (
            <div key={p} style={s.perkItem}>
              <span style={{ color: '#0F6E56', fontWeight: 600 }}>✓</span> {p}
            </div>
          ))}
        </div>
        {paymentData?.amount && (
          <p style={{ fontSize: 13, color: '#4a4f4b', marginBottom: 20 }}>
            Amount paid: <strong>₹{(paymentData.amount / 100).toFixed(0)}</strong>
          </p>
        )}
        <button style={s.dashBtn} onClick={() => navigate('/patient/dashboard')}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
