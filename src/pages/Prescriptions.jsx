import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly'];
const durations = ['3 days', '5 days', '7 days', '10 days', '2 weeks', '1 month', '3 months', 'Ongoing'];

const statusColors = {
  active: { bg: '#E1F5EE', color: '#085041' },
  completed: { bg: '#E6F1FB', color: '#0C447C' },
  discontinued: { bg: '#FEE2E2', color: '#991B1B' },
};

const s = {
  page: { minHeight: '100vh', background: '#f4f6f4' },
  navbar: { background: '#0F6E56', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 },
  navDot: { width: 9, height: 9, borderRadius: '50%', background: '#5DCAA5' },
  navLogo: { color: '#fff', fontSize: 15, fontWeight: 500 },
  navRight: { marginLeft: 'auto', display: 'flex', gap: 10 },
  backBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, cursor: 'pointer' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  main: { padding: 24, maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 600, color: '#111211' },
  addBtn: { background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 },
  card: { background: '#fff', border: '1px solid #e2e6e2', borderRadius: 12, padding: 18 },
  rxIcon: { width: 40, height: 40, borderRadius: 10, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 },
  rxName: { fontSize: 15, fontWeight: 600, color: '#111211', marginBottom: 4 },
  rxDr: { fontSize: 12, color: '#4a4f4b', marginBottom: 12 },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
  metaBox: { background: '#f4f6f4', borderRadius: 7, padding: '7px 10px' },
  metaLabel: { fontSize: 10, color: '#8a8f8b', marginBottom: 2 },
  metaVal: { fontSize: 12, fontWeight: 500, color: '#111211' },
  badge: (status) => ({ ...statusColors[status], fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 500, display: 'inline-block', marginBottom: 12 }),
  actionRow: { display: 'flex', gap: 8, borderTop: '1px solid #f0f2f0', paddingTop: 12 },
  editBtn: { flex: 1, background: '#E6F1FB', color: '#0C447C', border: 'none', borderRadius: 6, padding: '7px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  deleteBtn: { flex: 1, background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 6, padding: '7px', fontSize: 12, cursor: 'pointer', fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#4a4f4b' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, margin: '0 16px' },
  modalTitle: { fontSize: 18, fontWeight: 600, marginBottom: 20 },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 500, color: '#4a4f4b', marginBottom: 5 },
  input: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fafbfa' },
  select: { width: '100%', border: '1px solid #e2e6e2', borderRadius: 8, padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fafbfa' },
  modalBtns: { display: 'flex', gap: 10, marginTop: 20 },
  modalSave: { flex: 1, background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  modalCancel: { flex: 1, background: '#f4f6f4', color: '#4a4f4b', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, cursor: 'pointer' },
  error: { background: '#FEE2E2', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#991B1B', marginBottom: 14 },
};

const emptyForm = { medicationName: '', dosage: '', frequency: 'Once daily', duration: '7 days', doctorName: '', notes: '' };

export default function Prescriptions() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/api/prescriptions');
      setPrescriptions(data.prescriptions);
    } catch (err) {
      console.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setError(''); setShowModal(true); };
  const openEdit = (rx) => {
    setForm({ medicationName: rx.medicationName, dosage: rx.dosage, frequency: rx.frequency, duration: rx.duration, doctorName: rx.doctorName, notes: rx.notes });
    setEditingId(rx._id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.medicationName || !form.dosage) { setError('Medication name and dosage are required'); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { data } = await api.put(`/api/prescriptions/${editingId}`, form);
        setPrescriptions(prev => prev.map(p => p._id === editingId ? data.prescription : p));
      } else {
        const { data } = await api.post('/api/prescriptions', form);
        setPrescriptions(prev => [data.prescription, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prescription?')) return;
    try {
      await api.delete(`/api/prescriptions/${id}`);
      // Instant state update — no reload
      setPrescriptions(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navDot} />
        <span style={s.navLogo}>VitalSync — Prescriptions</span>
        <div style={s.navRight}>
          <button style={s.backBtn} onClick={() => navigate('/patient/dashboard')}>← Dashboard</button>
          <button style={s.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>My Prescriptions</h1>
            <p style={{ fontSize: 13, color: '#4a4f4b', marginTop: 4 }}>{prescriptions.length} total prescriptions</p>
          </div>
          <button style={s.addBtn} onClick={openAdd}>+ Add Prescription</button>
        </div>

        {loading ? <p style={{ textAlign: 'center', padding: 40, color: '#4a4f4b' }}>Loading...</p> :
          prescriptions.length === 0 ? (
            <div style={s.empty}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>No prescriptions yet</p>
            </div>
          ) : (
            <div style={s.grid}>
              {prescriptions.map(rx => (
                <div key={rx._id} style={s.card}>
                  <div style={s.rxIcon}>💊</div>
                  <div style={s.rxName}>{rx.medicationName}</div>
                  <div style={s.rxDr}>Prescribed by {rx.doctorName || 'Unknown'}</div>
                  <span style={s.badge(rx.status)}>{rx.status}</span>
                  <div style={s.metaGrid}>
                    <div style={s.metaBox}><div style={s.metaLabel}>DOSAGE</div><div style={s.metaVal}>{rx.dosage}</div></div>
                    <div style={s.metaBox}><div style={s.metaLabel}>FREQUENCY</div><div style={s.metaVal}>{rx.frequency}</div></div>
                    <div style={s.metaBox}><div style={s.metaLabel}>DURATION</div><div style={s.metaVal}>{rx.duration}</div></div>
                    <div style={s.metaBox}><div style={s.metaLabel}>ADDED</div><div style={s.metaVal}>{new Date(rx.createdAt).toLocaleDateString('en-IN')}</div></div>
                  </div>
                  {rx.notes && <p style={{ fontSize: 12, color: '#4a4f4b', marginBottom: 12 }}>{rx.notes}</p>}
                  <div style={s.actionRow}>
                    <button style={s.editBtn} onClick={() => openEdit(rx)}>✏️ Edit</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(rx._id)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingId ? 'Edit Prescription' : 'Add Prescription'}</h2>
            {error && <div style={s.error}>{error}</div>}
            <div style={s.field}><label style={s.label}>Medication Name</label><input style={s.input} placeholder="Atorvastatin" value={form.medicationName} onChange={e => setForm({ ...form, medicationName: e.target.value })} /></div>
            <div style={s.field}><label style={s.label}>Dosage</label><input style={s.input} placeholder="10mg" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} /></div>
            <div style={s.field}><label style={s.label}>Frequency</label><select style={s.select} value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>{frequencies.map(f => <option key={f}>{f}</option>)}</select></div>
            <div style={s.field}><label style={s.label}>Duration</label><select style={s.select} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>{durations.map(d => <option key={d}>{d}</option>)}</select></div>
            <div style={s.field}><label style={s.label}>Doctor Name</label><input style={s.input} placeholder="Dr. Mehra" value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} /></div>
            <div style={s.field}><label style={s.label}>Notes (optional)</label><input style={s.input} placeholder="Take with food..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div style={s.modalBtns}>
              <button style={s.modalCancel} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.modalSave} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add Prescription'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
