import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const s = {
  page: { minHeight: '100vh', background: '#f4f6f4', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 },
  badge: { background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20 },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#04342C' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  layout: { display: 'grid', gridTemplateColumns: '200px 1fr', flex: 1, minHeight: 'calc(100vh - 53px)' },
  sidebar: { background: '#fff', borderRight: '1px solid #e2e6e2', padding: '20px 0' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', fontSize: 13, color: active ? '#085041' : '#4a4f4b', background: active ? '#E1F5EE' : 'transparent', borderRight: active ? '2px solid #0F6E56' : '2px solid transparent', cursor: 'pointer', fontWeight: active ? 500 : 400 }),
  infoCard: { margin: '16px 12px 0', background: '#E1F5EE', borderRadius: 10, padding: '12px' },
  infoTitle: { fontSize: 11, fontWeight: 600, color: '#085041', marginBottom: 6 },
  infoRow: { fontSize: 11, color: '#0F6E56', marginBottom: 3 },
  main: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  greeting: { fontSize: 18, fontWeight: 600, color: '#111211' },
  greetingSub: { fontSize: 13, color: '#4a4f4b', marginTop: 3 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statCard: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '14px 16px' },
  statVal: { fontSize: 22, fontWeight: 600, color: '#111211' },
  statLabel: { fontSize: 11, color: '#4a4f4b', marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#111211', marginBottom: 12 },
  apptCard: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 },
  dateBox: { background: '#E1F5EE', borderRadius: 8, padding: '8px 10px', textAlign: 'center', minWidth: 42 },
  dateDay: { fontSize: 18, fontWeight: 600, color: '#085041', lineHeight: 1 },
  dateMon: { fontSize: 9, color: '#0F6E56', textTransform: 'uppercase', marginTop: 2 },
  apptInfo: { flex: 1 },
  apptName: { fontSize: 13, fontWeight: 500, color: '#111211' },
  apptSub: { fontSize: 11, color: '#4a4f4b', marginTop: 2 },
  confirmed: { background: '#E1F5EE', color: '#085041', fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500 },
  pending: { background: '#FEF3C7', color: '#92400E', fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '16px' },
  tlItem: { display: 'flex', gap: 10, marginBottom: 14 },
  tlDot: (color) => ({ width: 9, height: 9, borderRadius: '50%', background: color || '#0F6E56', marginTop: 4, flexShrink: 0 }),
  tlTitle: { fontSize: 12, fontWeight: 500, color: '#111211' },
  tlSub: { fontSize: 11, color: '#4a4f4b', marginTop: 2 },
  rxRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f2f0' },
  rxIcon: { width: 28, height: 28, borderRadius: 7, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  rxName: { fontSize: 12, fontWeight: 500, color: '#111211' },
  rxSub: { fontSize: 11, color: '#4a4f4b', marginTop: 1 },
  apiBox: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '16px' },
  apiTitle: { fontSize: 13, fontWeight: 600, color: '#111211', marginBottom: 8 },
  apiData: { background: '#f4f6f4', borderRadius: 8, padding: 12, fontSize: 12, color: '#4a4f4b', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' },
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Demo: call the protected /api/patients endpoint to prove auth works
  const fetchProtectedData = async () => {
    setApiLoading(true);
    try {
      const { data } = await api.get('/api/patients');
      setPatientData(data);
    } catch (err) {
      setPatientData({ error: err.response?.data?.message || 'Request failed' });
    } finally {
      setApiLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PA';

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync</span>
        <div style={s.navRight}>
          <span style={s.badge}>Patient Portal</span>
          <div style={s.avatar}>{initials}</div>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <div style={s.layout}>
        <div style={s.sidebar}>
          {[
            { icon: '⊞', label: 'Dashboard', active: true },
            { icon: '📅', label: 'Appointments' },
            { icon: '📋', label: 'History' },
            { icon: '💊', label: 'Prescriptions' },
            { icon: '👨‍⚕️', label: 'My Doctors' },
          ].map((item) => (
            <div key={item.label} style={s.navItem(item.active)}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
          <div style={s.infoCard}>
            <p style={s.infoTitle}>Health Summary</p>
            <p style={s.infoRow}>Blood type: <strong>A+</strong></p>
            <p style={s.infoRow}>Allergies: <strong>Penicillin</strong></p>
            <p style={s.infoRow}>Last visit: <strong>Jun 2</strong></p>
          </div>
        </div>

        <div style={s.main}>
          <div>
            <p style={s.greeting}>Good morning, {user?.name?.split(' ')[0]} 👋</p>
            <p style={s.greetingSub}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · All records up to date
            </p>
          </div>

          <div style={s.statsRow}>
            {[
              { val: '3', label: '🟢 Upcoming appointments' },
              { val: '2', label: '🔵 Active prescriptions' },
              { val: '12', label: '⚫ Past visits' },
              { val: 'A+', label: 'Blood type', color: '#0F6E56' },
            ].map((stat) => (
              <div key={stat.label} style={s.statCard}>
                <div style={{ ...s.statVal, color: stat.color || '#111211' }}>{stat.val}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div>
            <p style={s.sectionTitle}>Upcoming appointments</p>
            {[
              { day: '14', mon: 'Jul', doctor: 'Dr. Sanjay Mehra · Cardiologist', time: '10:30 AM · City Heart Hospital · Room 204', status: 'confirmed' },
              { day: '21', mon: 'Jul', doctor: 'Dr. Priya Nair · Dermatologist', time: '2:00 PM · SkinCare Clinic · Room 11', status: 'pending' },
            ].map((appt) => (
              <div key={appt.day + appt.mon} style={s.apptCard}>
                <div style={s.dateBox}>
                  <div style={s.dateDay}>{appt.day}</div>
                  <div style={s.dateMon}>{appt.mon}</div>
                </div>
                <div style={s.apptInfo}>
                  <div style={s.apptName}>{appt.doctor}</div>
                  <div style={s.apptSub}>{appt.time}</div>
                </div>
                <span style={appt.status === 'confirmed' ? s.confirmed : s.pending}>
                  {appt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>

          <div style={s.twoCol}>
            <div style={s.card}>
              <p style={s.sectionTitle}>Medical history</p>
              {[
                { color: '#0F6E56', title: 'Cardiac Checkup · Jun 2', sub: 'Dr. Mehra — ECG normal, BP 120/80' },
                { color: '#185FA5', title: 'Skin Allergy Review · May 15', sub: 'Dr. Nair — Prescribed antihistamine' },
                { color: '#888780', title: 'Annual Physical · Mar 8', sub: 'Dr. Kumar — All clear, routine bloodwork' },
              ].map((item) => (
                <div key={item.title} style={s.tlItem}>
                  <div style={s.tlDot(item.color)} />
                  <div>
                    <div style={s.tlTitle}>{item.title}</div>
                    <div style={s.tlSub}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <p style={s.sectionTitle}>Active prescriptions</p>
              {[
                { name: 'Atorvastatin 10mg', sub: '1 tablet · Daily · Dr. Mehra' },
                { name: 'Cetirizine 5mg', sub: '1 tablet · As needed · Dr. Nair' },
              ].map((rx) => (
                <div key={rx.name} style={s.rxRow}>
                  <div style={s.rxIcon}>💊</div>
                  <div>
                    <div style={s.rxName}>{rx.name}</div>
                    <div style={s.rxSub}>{rx.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live API Test Section */}
          <div style={s.apiBox}>
            <p style={s.apiTitle}>🔐 Live API Test — Protected Route</p>
            <p style={{ fontSize: 12, color: '#4a4f4b', marginBottom: 12 }}>
              Click below to call <code style={{ background: '#f4f6f4', padding: '1px 6px', borderRadius: 4 }}>/api/patients</code> with your JWT. If auth works, you'll see real data from the backend.
            </p>
            <button
              onClick={fetchProtectedData}
              disabled={apiLoading}
              style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginBottom: 12 }}
            >
              {apiLoading ? 'Fetching...' : 'Test Protected API →'}
            </button>
            {patientData && (
              <div style={s.apiData}>{JSON.stringify(patientData, null, 2)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
