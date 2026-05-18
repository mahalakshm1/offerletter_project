import { useEffect, useState } from 'react';
import api from '../api';

const empty = { name: '', content: '' };

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const load = () => api.get('/api/templates').then((r) => setTemplates(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setError(''); setModal('create'); };
  const openEdit   = (t) => { setForm({ name: t.name, content: t.content }); setError(''); setModal(t); };
  const close      = () => setModal(null);

  const save = async (e) => {
    e.preventDefault(); setError('');
    try {
      modal === 'create'
        ? await api.post('/api/templates', form)
        : await api.put(`/api/templates/${modal.id}`, form);
      load(); close();
    } catch (err) { setError(err.response?.data?.message || 'Error saving template'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this template?')) return;
    await api.delete(`/api/templates/${id}`); load();
  };

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1>Templates</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>＋ New Template</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Template Name</th><th>Created</th><th>Last Updated</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {templates.length === 0 && (
              <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">📝</div><p>No templates yet. Create your first one!</p></div></td></tr>
            )}
            {templates.map((t) => (
              <tr key={t.id}>
                <td><strong style={{ color: '#0f172a' }}>{t.name}</strong></td>
                <td style={{ color: '#64748b' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                <td style={{ color: '#64748b' }}>{new Date(t.updated_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => openEdit(t)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(t.id)}>🗑️ Delete</button>
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
              <h2>{modal === 'create' ? '📝 New Template' : '✏️ Edit Template'}</h2>
              <button className="modal-close" onClick={close}>✕</button>
            </div>
            {error && <div className="error">⚠️ {error}</div>}
            <form onSubmit={save}>
              <label className="input-label">Template Name</label>
              <input placeholder="e.g. Software Engineer Offer" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <label className="input-label">HTML Content</label>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', marginTop: '-0.5rem' }}>
                Use placeholders: <code style={{ background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{'{{name}} {{position}} {{department}} {{salary}} {{doj}}'}</code>
              </p>
              <textarea
                placeholder="<p>Dear {{name}}, you are hired as {{position}}...</p>"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={10}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">💾 Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
