import { useEffect, useState } from 'react';
import api from '../api';

const empty = { name: '', email: '', position: '', department: '', doj: '', salary: '' };

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = (q = '') => api.get(`/api/candidates${q ? `?search=${q}` : ''}`).then((r) => setCandidates(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit   = (c) => { setForm({ name: c.name, email: c.email, position: c.position || '', department: c.department || '', doj: c.doj?.slice(0, 10) || '', salary: c.salary || '' }); setError(''); setModal(c); };
  const close      = () => setModal(null);

  const save = async (e) => {
    e.preventDefault(); setError('');
    try {
      modal === 'create'
        ? await api.post('/api/candidates', form)
        : await api.put(`/api/candidates/${modal.id}`, form);
      load(search); close();
    } catch (err) { setError(err.response?.data?.message || 'Error saving candidate'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this candidate?')) return;
    await api.delete(`/api/candidates/${id}`); load(search);
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1>Candidates</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>＋ Add Candidate</button>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Position</th><th>Department</th><th>DOJ</th><th>Salary</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {candidates.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">👥</div><p>No candidates found.</p></div></td></tr>
            )}
            {candidates.map((c) => (
              <tr key={c.id}>
                <td><strong style={{ color: '#0f172a' }}>{c.name}</strong></td>
                <td style={{ color: '#64748b' }}>{c.email}</td>
                <td>{c.position || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td>{c.department || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td style={{ color: '#64748b' }}>{c.doj ? new Date(c.doj).toLocaleDateString() : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td>{c.salary ? <span style={{ fontWeight: 600, color: '#10b981' }}>{c.salary}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modal === 'create' ? '👤 Add Candidate' : '✏️ Edit Candidate'}</h2>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            {error && <div className="error">⚠️ {error}</div>}
            <form onSubmit={save}>
              <div className="form-row">
                <div><label className="input-label">Full Name</label><input placeholder="Jane Smith" value={form.name} onChange={set('name')} required /></div>
                <div><label className="input-label">Email</label><input type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} required /></div>
              </div>
              <div className="form-row">
                <div><label className="input-label">Position</label><input placeholder="Backend Developer" value={form.position} onChange={set('position')} /></div>
                <div><label className="input-label">Department</label><input placeholder="Engineering" value={form.department} onChange={set('department')} /></div>
              </div>
              <div className="form-row">
                <div><label className="input-label">Date of Joining</label><input type="date" value={form.doj} onChange={set('doj')} /></div>
                <div><label className="input-label">Salary</label><input placeholder="80000" value={form.salary} onChange={set('salary')} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">💾 Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
