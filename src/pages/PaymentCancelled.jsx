import { useNavigate } from 'react-router-dom';

export default function PaymentCancelled() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>😕</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111211', marginBottom: 12 }}>Payment Cancelled</h1>
        <p style={{ fontSize: 14, color: '#4a4f4b', marginBottom: 32, lineHeight: 1.6 }}>
          No worries — your payment was cancelled and nothing was charged. You can upgrade anytime.
        </p>
        <button
          onClick={() => navigate('/upgrade')}
          style={{ width: '100%', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/patient/dashboard')}
          style={{ width: '100%', background: '#f4f6f4', color: '#4a4f4b', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
