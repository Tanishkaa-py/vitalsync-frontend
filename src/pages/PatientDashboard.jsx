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
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', fontSize: 13, color: active ? '#085041' : '#4a4f4b', background: active ? '#E1F5EE' : 'transparent', borderRight: active ? '2px solid #0F6E56' : '2px solid transparent', cursor: 'pointer', fontWeight: active ? 500 : 400, border: 'none', width: '100%', textAlign: 'left' }),
  infoCard: { margin: '16px 12px 0', background: '#E1F5EE', borderRadius: 10, padding: '12px' },
  proBtn: { margin: '12px 12px 0', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: 'calc(100% - 24px)', textAlign: 'center' },
  main: { padding: 24, display: 'flex', flexDirection: 'column', gap: 20 },
  greeting: { fontSize: 18, fontWeight: 600, color: '#111211' },
  greetingSub: { fontSize: 13, color: '#4a4f4b', marginTop: 3 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statCard: (clickable) => ({ background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '14px 16px', cursor: clickable ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }),
  statVal: { fontSize: 22, fontWeight: 600, color: '#111211' },
  statLabel: { fontSize: 11, color: '#4a4f4b', marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#111211', marginBottom: 12 },
  apptCard: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 },
  dateBox: { background: '#E1F5EE', borderRadius: 8, padding: '8px 10px', textAlign: 'center', minWidth: 42 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { fontSize: 11, color: '#0F6E56', cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none' },
  tlItem: { display: 'flex', gap: 10, marginBottom: 14 },
  tlDot: (color) => ({ width: 9, height: 9, borderRadius: '50%', background: color || '#0F6E56', marginTop: 4, flexShrink: 0 }),
  rxRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f2f0' },
  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  actionCard: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 10, padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: 500, color: '#111211' },
  actionSub: { fontSize: 11, color: '#4a4f4b', marginTop: 2 },
};

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, rxRes] = await Promise.all([
          api.get('/api/appointments'),
          api.get('/api/prescriptions'),
        ]);
        setAppointments(apptRes.data.appointments);
        setPrescriptions(rxRes.data.prescriptions);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PA';
  const upcomingAppts = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed');
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');

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
            { icon: '⊞', label: 'Dashboard', path: '/patient/dashboard', active: true },
            { icon: '📅', label: 'Appointments', path: '/appointments' },
            { icon: '💊', label: 'Prescriptions', path: '/prescriptions' },
            { icon: '🤖', label: 'AI Assistant', path: '/ai' },
          ].map((item) => (
            <button key={item.label} style={s.navItem(item.active)} onClick={() => navigate(item.path)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={s.infoCard}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#085041', marginBottom: 4 }}>Health Summary</p>
            <p style={{ fontSize: 11, color: '#0F6E56', marginBottom: 2 }}>Blood type: <strong>A+</strong></p>
            <p style={{ fontSize: 11, color: '#0F6E56' }}>Allergies: <strong>Penicillin</strong></p>
          </div>
          <button style={s.proBtn} onClick={() => navigate('/upgrade')}>⭐ Upgrade to Pro</button>
        </div>

        <div style={s.main}>
          <div>
            <p style={s.greeting}>Good morning, {user?.name?.split(' ')[0]} 👋</p>
            <p style={s.greetingSub}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Stats — clickable cards */}
          <div style={s.statsRow}>
            <div style={s.statCard(true)} onClick={() => navigate('/appointments')}>
              <div style={s.statVal}>{loading ? '—' : upcomingAppts.length}</div>
              <div style={s.statLabel}>🟢 Upcoming appts</div>
            </div>
            <div style={s.statCard(true)} onClick={() => navigate('/prescriptions')}>
              <div style={s.statVal}>{loading ? '—' : activePrescriptions.length}</div>
              <div style={s.statLabel}>🔵 Active prescriptions</div>
            </div>
            <div style={s.statCard(false)}>
              <div style={s.statVal}>{loading ? '—' : appointments.length}</div>
              <div style={s.statLabel}>⚫ Total appointments</div>
            </div>
            <div style={s.statCard(false)}>
              <div style={{ ...s.statVal, color: '#0F6E56' }}>A+</div>
              <div style={s.statLabel}>Blood type</div>
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <p style={s.sectionTitle}>Quick Actions</p>
            <div style={s.quickActions}>
              <div style={s.actionCard} onClick={() => navigate('/appointments')}>
                <div style={s.actionIcon}>📅</div>
                <div style={s.actionLabel}>Book Appointment</div>
                <div style={s.actionSub}>Schedule with a doctor</div>
              </div>
              <div style={s.actionCard} onClick={() => navigate('/prescriptions')}>
                <div style={s.actionIcon}>💊</div>
                <div style={s.actionLabel}>Add Prescription</div>
                <div style={s.actionSub}>Track your medications</div>
              </div>
              <div style={s.actionCard} onClick={() => navigate('/ai')}>
                 <div style={s.actionIcon}>🤖</div>
                 <div style={s.actionLabel}>AI Assistant</div>
                  <div style={s.actionSub}>Ask health-related questions</div>
              </div>
              <div style={s.actionCard} onClick={() => navigate('/upgrade')}>
                <div style={s.actionIcon}>⭐</div>
                <div style={s.actionLabel}>Upgrade to Pro</div>
                <div style={s.actionSub}>Unlock all features</div>
              </div>
            </div>
          </div>

          <div style={s.twoCol}>
            {/* Recent Appointments */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <p style={s.sectionTitle}>Recent Appointments</p>
                <button style={s.viewAll} onClick={() => navigate('/appointments')}>View all →</button>
              </div>
              {loading ? <p style={{ fontSize: 13, color: '#4a4f4b' }}>Loading...</p> :
                appointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ fontSize: 13, color: '#4a4f4b', marginBottom: 10 }}>No appointments yet</p>
                    <button onClick={() => navigate('/appointments')} style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>Book Now</button>
                  </div>
                ) : (
                  appointments.slice(0, 3).map(appt => (
                    <div key={appt._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f2f0' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📅</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#111211' }}>{appt.doctorName}</div>
                        <div style={{ fontSize: 11, color: '#4a4f4b' }}>{appt.date} · {appt.timeSlot}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500, background: appt.status === 'confirmed' ? '#E1F5EE' : '#FEF3C7', color: appt.status === 'confirmed' ? '#085041' : '#92400E' }}>{appt.status}</span>
                    </div>
                  ))
                )}
            </div>

            {/* Active Prescriptions */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <p style={s.sectionTitle}>Active Prescriptions</p>
                <button style={s.viewAll} onClick={() => navigate('/prescriptions')}>View all →</button>
              </div>
              {loading ? <p style={{ fontSize: 13, color: '#4a4f4b' }}>Loading...</p> :
                activePrescriptions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ fontSize: 13, color: '#4a4f4b', marginBottom: 10 }}>No active prescriptions</p>
                    <button onClick={() => navigate('/prescriptions')} style={{ background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>Add One</button>
                  </div>
                ) : (
                  activePrescriptions.slice(0, 3).map(rx => (
                    <div key={rx._id} style={s.rxRow}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💊</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#111211' }}>{rx.medicationName}</div>
                        <div style={{ fontSize: 11, color: '#4a4f4b' }}>{rx.dosage} · {rx.frequency}</div>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
