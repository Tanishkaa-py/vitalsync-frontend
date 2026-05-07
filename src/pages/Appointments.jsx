import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'General Physician', 'Pediatrics', 'Psychiatry'];
const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

const statusColors = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  confirmed: { bg: '#E1F5EE', color: '#085041' },
  completed: { bg: '#E6F1FB', color: '#0C447C' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
};

const s = {
  page: { minHeight: '100vh', background: '#f4f6f4', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, cursor: 'pointer' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  main: { padding: 24, maxWidth: 900, margin: '0 auto', width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 600, color: '#111211' },
  addBtn: { background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  card: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 12, padding: 20, marginBottom: 12 },
  apptHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  apptTitle: { fontSize: 15, fontWeight: 600, color: '#111211' },
  apptSub: { fontSize: 12, color: '#4a4f4b', marginTop: 3 },
  badge: (status) => ({ ...statusColors[status], fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }),
  apptMeta: { display: 'flex', gap: 16, marginTop: 10 },
  metaItem: { fontSize: 12, color: '#4a4f4b' },
  metaLabel: { fontWeight: 500, color: '#111211' },
  actionRow: { display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0f2f0' },
  editBtn: { background: '#E6F1FB', color: '#0C447C', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  deleteBtn: { background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  confirmBtn: { background: '#E1F5EE', color: '#085041', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#4a4f4b' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, margin: '0 16px' },
  modalTitle: { fontSize: 18, fontWeight: 600, color: '#111211', marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 500, color: '#4a4f4b', marginBottom: 6 },
  input: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fafbfa' },
  select: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fafbfa' },
  modalBtns: { display: 'flex', gap: 10, marginTop: 20 },
  modalSave: { flex: 1, background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  modalCancel: { flex: 1, background: '#f4f6f4', color: '#4a4f4b', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, cursor: 'pointer' },
  error: { background: '#FEE2E2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#991B1B', marginBottom: 16 },
  loading: { textAlign: 'center', padding: 40, color: '#4a4f4b' },
};

const emptyForm = { doctorName: '', specialty: 'Cardiology', date: '', timeSlot: '9:00 AM', notes: '' };

export default function Appointments() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // READ — fetch all appointments
  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments');
      setAppointments(data.appointments);
    } catch (err) {
      console.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (appt) => {
    setForm({ doctorName: appt.doctorName, specialty: appt.specialty, date: appt.date, timeSlot: appt.timeSlot, notes: appt.notes });
    setEditingId(appt._id);
    setError('');
    setShowModal(true);
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!form.doctorName || !form.date) {
      setError('Doctor name and date are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        // UPDATE
        const { data } = await api.put(`/api/appointments/${editingId}`, form);
        // Update state instantly — no page reload
        setAppointments(prev => prev.map(a => a._id === editingId ? data.appointment : a));
      } else {
        // CREATE
        const { data } = await api.post('/api/appointments', form);
        setAppointments(prev => [data.appointment, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appointment');
    } finally {
      setSaving(false);
    }
  };

  // DELETE — removes from state instantly
  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/api/appointments/${id}`);
      // Instantly remove from state — no page reload needed
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  // UPDATE STATUS — confirm appointment
  const handleConfirm = async (id) => {
    try {
      const { data } = await api.put(`/api/appointments/${id}`, { status: 'confirmed' });
      setAppointments(prev => prev.map(a => a._id === id ? data.appointment : a));
    } catch (err) {
      alert('Failed to confirm appointment');
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync — Appointments</span>
        <div style={s.navRight}>
          <button style={s.backBtn} onClick={() => navigate('/patient/dashboard')}>← Dashboard</button>
          <button style={s.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>My Appointments</h1>
            <p style={{ fontSize: 13, color: '#4a4f4b', marginTop: 4 }}>{appointments.length} total appointments</p>
          </div>
          <button style={s.addBtn} onClick={openAdd}>+ Book Appointment</button>
        </div>

        {loading ? (
          <div style={s.loading}>Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📅</div>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>No appointments yet</p>
            <p style={{ fontSize: 13 }}>Click "Book Appointment" to schedule your first one</p>
          </div>
        ) : (
          appointments.map(appt => (
            <div key={appt._id} style={s.card}>
              <div style={s.apptHeader}>
                <div>
                  <div style={s.apptTitle}>{appt.doctorName}</div>
                  <div style={s.apptSub}>{appt.specialty}</div>
                </div>
                <span style={s.badge(appt.status)}>{appt.status}</span>
              </div>
              <div style={s.apptMeta}>
                <div style={s.metaItem}><span style={s.metaLabel}>Date: </span>{appt.date}</div>
                <div style={s.metaItem}><span style={s.metaLabel}>Time: </span>{appt.timeSlot}</div>
                {appt.notes && <div style={s.metaItem}><span style={s.metaLabel}>Notes: </span>{appt.notes}</div>}
              </div>
              <div style={s.actionRow}>
                <button style={s.editBtn} onClick={() => openEdit(appt)}>✏️ Edit</button>
                {appt.status === 'pending' && (
                  <button style={s.confirmBtn} onClick={() => handleConfirm(appt._id)}>✓ Confirm</button>
                )}
                <button style={s.deleteBtn} onClick={() => handleDelete(appt._id)}>🗑 Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingId ? 'Edit Appointment' : 'Book Appointment'}</h2>
            {error && <div style={s.error}>{error}</div>}
            <div style={s.field}>
              <label style={s.label}>Doctor Name</label>
              <input style={s.input} placeholder="Dr. Sanjay Mehra" value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Specialty</label>
              <select style={s.select} value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}>
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Date</label>
              <input style={s.input} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Time Slot</label>
              <select style={s.select} value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Notes (optional)</label>
              <input style={s.input} placeholder="Reason for visit..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={s.modalBtns}>
              <button style={s.modalCancel} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.modalSave} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Appointment' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
