import { useEffect, useState } from 'react';
import api from '../api';

const STATUS_COLORS = { draft: 'badge-draft', generated: 'badge-generated', sent: 'badge-sent', viewed: 'badge-viewed', accepted: 'badge-accepted', rejected: 'badge-rejected', expired: 'badge-expired' };

const STATUS_TRANSITIONS = {
  draft:     ['generated'],
  generated: ['sent'],
  sent:      ['viewed'],
  viewed:    ['accepted', 'rejected'],
  accepted:  ['expired'],
  rejected:  [],
  expired:   [],
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ candidate_id: '', template_id: '', salary: '', doj: '' });
  const [error, setError] = useState('');

  const load = (s = '') => api.get(`/api/offers${s ? `?status=${s}` : ''}`).then((r) => setOffers(r.data));

  useEffect(() => {
    load();
    api.get('/api/candidates').then((r) => setCandidates(r.data));
    api.get('/api/templates').then((r) => setTemplates(r.data));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const generate = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/api/offers', form);
      load(statusFilter);
      setModal(false);
      setForm({ candidate_id: '', template_id: '', salary: '', doj: '' });
    } catch (err) { setError(err.response?.data?.message || 'Error generating offer'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.patch(`/api/offers/${id}/status`, { status }); load(statusFilter); }
    catch (err) { alert(err.response?.data?.message || 'Invalid status transition'); }
  };

  const sendEmail = async (id) => {
    try { await api.post(`/api/offers/${id}/send`); alert('✅ Email sent!'); load(statusFilter); }
    catch (err) { alert(err.response?.data?.message || 'Failed to send email'); }
  };

  const downloadPdf = (id) => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/offers/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `offer-${id}.pdf`; a.click(); });
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1>Offers</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>{offers.length} offer{offers.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(''); setModal(true); }}>＋ Generate Offer</button>
      </div>

      <div className="toolbar">
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Filter:</span>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); load(e.target.value); }}>
          <option value="">All Statuses</option>
          {Object.keys(STATUS_TRANSITIONS).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Candidate</th><th>Template</th><th>Status</th><th>Salary</th><th>DOJ</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {offers.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📄</div><p>No offers found.</p></div></td></tr>
            )}
            {offers.map((o) => (
              <tr key={o.id}>
                <td><strong style={{ color: '#0f172a' }}>{o.candidate?.name || '—'}</strong><br /><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{o.candidate?.email}</span></td>
                <td style={{ color: '#475569' }}>{o.template?.name || '—'}</td>
                <td><span className={`badge ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                <td>{o.salary ? <span style={{ fontWeight: 600, color: '#10b981' }}>{o.salary}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td style={{ color: '#64748b' }}>{o.doj ? new Date(o.doj).toLocaleDateString() : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {STATUS_TRANSITIONS[o.status]?.length > 0 ? (
                      STATUS_TRANSITIONS[o.status].map((next) => (
                        <button
                          key={next}
                          className="btn btn-sm"
                          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', fontSize: '0.72rem', fontWeight: 600, color: '#334155' }}
                          onClick={() => updateStatus(o.id, next)}
                        >
                          → {next}
                        </button>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>No transitions</span>
                    )}
                    <button className="btn btn-primary btn-sm" onClick={() => sendEmail(o.id)} title="Send Email">📨</button>
                    <button className="btn btn-success btn-sm" onClick={() => downloadPdf(o.id)} title="Download PDF">📥 PDF</button>
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
              <h2>📄 Generate Offer Letter</h2>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            {error && <div className="error">⚠️ {error}</div>}
            <form onSubmit={generate}>
              <label className="input-label">Candidate</label>
              <select value={form.candidate_id} onChange={set('candidate_id')} required>
                <option value="">Select a candidate…</option>
                {candidates.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
              </select>
              <label className="input-label">Template</label>
              <select value={form.template_id} onChange={set('template_id')} required>
                <option value="">Select a template…</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div className="form-row">
                <div><label className="input-label">Salary Override</label><input placeholder="Leave blank to use candidate's" value={form.salary} onChange={set('salary')} /></div>
                <div><label className="input-label">DOJ Override</label><input type="date" value={form.doj} onChange={set('doj')} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">🚀 Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
