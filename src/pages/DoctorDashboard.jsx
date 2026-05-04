import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0C447C', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#85B7EB' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 },
  badge: { background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: '#85B7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#042C53' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  layout: { display: 'grid', gridTemplateColumns: '200px 1fr', flex: 1 },
  sidebar: { background: '#fff', borderRight: '1px solid #e2e6e2', padding: '20px 0' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', fontSize: 13, color: active ? '#0C447C' : '#4a4f4b', background: active ? '#E6F1FB' : 'transparent', borderRight: active ? '2px solid #185FA5' : '2px solid transparent', cursor: 'pointer', fontWeight: active ? 500 : 400 }),
  infoCard: { margin: '16px 12px 0', background: '#E6F1FB', borderRadius: 10, padding: '12px' },
  infoTitle: { fontSize: 11, fontWeight: 600, color: '#0C447C', marginBottom: 6 },
  infoRow: { fontSize: 11, color: '#185FA5', marginBottom: 3 },
  main: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statCard: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '14px 16px' },
  statVal: { fontSize: 22, fontWeight: 600, color: '#111211' },
  statLabel: { fontSize: 11, color: '#4a4f4b', marginTop: 4 },
  availBanner: (on) => ({ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${on ? '#5DCAA5' : '#e2e6e2'}`, borderRadius: 10, padding: '10px 16px' }),
  availDot: (on) => ({ width: 9, height: 9, borderRadius: '50%', background: on ? '#16a34a' : '#9ca3af' }),
  availText: (on) => ({ fontSize: 13, color: on ? '#085041' : '#4a4f4b', fontWeight: 500, flex: 1 }),
  toggleBtn: (on) => ({ background: on ? '#E1F5EE' : '#f4f6f4', color: on ? '#085041' : '#4a4f4b', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11, cursor: 'pointer', fontWeight: 500 }),
  twoCol: { display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '16px' },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#111211', marginBottom: 12 },
  slot: { display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  slotTime: { fontSize: 11, color: '#4a4f4b', minWidth: 36, paddingTop: 6 },
  slotBlock: (booked) => ({ flex: 1, borderRadius: 7, padding: '7px 10px', background: booked ? '#E6F1FB' : '#f4f6f4', borderLeft: `3px solid ${booked ? '#185FA5' : '#e2e6e2'}` }),
  slotName: { fontSize: 12, fontWeight: 500, color: '#111211' },
  slotSub: { fontSize: 11, color: '#4a4f4b', marginTop: 1 },
  queueRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f2f0' },
  queueAvatar: { width: 28, height: 28, borderRadius: '50%', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: '#0C447C' },
  inSession: { background: '#E1F5EE', color: '#085041', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500 },
  waiting: { background: '#FEF3C7', color: '#92400E', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500 },
  scheduled: { background: '#f0f4f8', color: '#4a4f4b', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500 },
};

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'DR';

  const fetchProtected = async () => {
    setApiLoading(true);
    try {
      const { data } = await api.get('/api/patients');
      setApiData(data);
    } catch (err) {
      setApiData({ error: err.response?.data?.message });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync</span>
        <div style={s.navRight}>
          <span style={s.badge}>Doctor Portal</span>
          <div style={s.avatar}>{initials}</div>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <div style={s.layout}>
        <div style={s.sidebar}>
          {[
            { icon: '⊞', label: 'Dashboard', active: true },
            { icon: '📅', label: 'My Schedule' },
            { icon: '👥', label: 'My Patients' },
            { icon: '💊', label: 'Prescriptions' },
          ].map((item) => (
            <div key={item.label} style={s.navItem(item.active)}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
          <div style={s.infoCard}>
            <p style={s.infoTitle}>{user?.name}</p>
            <p style={s.infoRow}>Cardiologist</p>
            <p style={s.infoRow}>City Heart Hospital</p>
            <p style={s.infoRow}>MCI/2018/4421</p>
          </div>
        </div>

        <div style={s.main}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#111211' }}>Good morning, {user?.name} 👋</p>
            <p style={{ fontSize: 13, color: '#4a4f4b', marginTop: 3 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · 6 appointments today
            </p>
          </div>

          <div style={s.statsRow}>
            {[
              { val: '6', label: "Today's patients" },
              { val: '2', label: 'Waiting now' },
              { val: '48', label: 'This month' },
              { val: available ? '● On' : '● Off', label: 'Availability', color: available ? '#16a34a' : '#9ca3af' },
            ].map((stat) => (
              <div key={stat.label} style={s.statCard}>
                <div style={{ ...s.statVal, color: stat.color || '#111211', fontSize: stat.color ? 16 : 22 }}>{stat.val}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={s.availBanner(available)}>
            <div style={s.availDot(available)} />
            <span style={s.availText(available)}>
              {available ? 'Currently available — accepting new bookings' : 'Currently unavailable — not accepting bookings'}
            </span>
            <button style={s.toggleBtn(available)} onClick={() => setAvailable(!available)}>
              {available ? 'Toggle off' : 'Toggle on'}
            </button>
          </div>

          <div style={s.twoCol}>
            <div style={s.card}>
              <p style={s.sectionTitle}>Today's schedule</p>
              {[
                { time: '9:00', name: 'Riya Arora · Follow-up', sub: 'Cardiac checkup, ECG review', booked: true },
                { time: '10:00', name: 'Arjun Shah · New patient', sub: 'Chest pain evaluation', booked: true },
                { time: '11:00', name: 'Available slot', sub: '', booked: false },
                { time: '2:00', name: 'Meena Iyer · Consultation', sub: 'Hypertension management', booked: true },
                { time: '3:00', name: 'Raj Pillai · Follow-up', sub: 'Post-surgery review, 3-month', booked: true },
              ].map((slot) => (
                <div key={slot.time} style={s.slot}>
                  <span style={s.slotTime}>{slot.time}</span>
                  <div style={s.slotBlock(slot.booked)}>
                    <div style={{ ...s.slotName, color: slot.booked ? '#111211' : '#8a8f8b' }}>{slot.name}</div>
                    {slot.sub && <div style={s.slotSub}>{slot.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>Patient queue</p>
              {[
                { initials: 'RA', name: 'Riya Arora', time: '9:00 AM · Arrived', status: 'in' },
                { initials: 'AS', name: 'Arjun Shah', time: '10:00 AM · Waiting', status: 'waiting' },
                { initials: 'MI', name: 'Meena Iyer', time: '2:00 PM · Scheduled', status: 'scheduled' },
                { initials: 'RP', name: 'Raj Pillai', time: '3:00 PM · Scheduled', status: 'scheduled' },
              ].map((p) => (
                <div key={p.initials} style={s.queueRow}>
                  <div style={s.queueAvatar}>{p.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#111211' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#4a4f4b' }}>{p.time}</div>
                  </div>
                  <span style={p.status === 'in' ? s.inSession : p.status === 'waiting' ? s.waiting : s.scheduled}>
                    {p.status === 'in' ? 'In session' : p.status === 'waiting' ? 'Waiting' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live API test */}
          <div style={{ background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: 16 }}>
            <p style={s.sectionTitle}>🔐 Live API Test — Protected Route</p>
            <p style={{ fontSize: 12, color: '#4a4f4b', marginBottom: 12 }}>
              Your JWT is automatically sent with every request via the Axios interceptor.
            </p>
            <button onClick={fetchProtected} disabled={apiLoading}
              style={{ background: '#0C447C', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}>
              {apiLoading ? 'Fetching...' : 'Test Protected API →'}
            </button>
            {apiData && (
              <pre style={{ background: '#f0f4f8', borderRadius: 8, padding: 12, fontSize: 11, color: '#111211', overflow: 'auto' }}>
                {JSON.stringify(apiData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
