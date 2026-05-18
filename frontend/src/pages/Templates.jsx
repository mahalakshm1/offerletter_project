import { useEffect, useState } from 'react';
import api from '../api';

const VARIABLES = [
  { token: '{{name}}',       label: 'Candidate Name',  color: '#3b82f6' },
  { token: '{{email}}',      label: 'Email',           color: '#8b5cf6' },
  { token: '{{position}}',   label: 'Position',        color: '#10b981' },
  { token: '{{department}}', label: 'Department',      color: '#f59e0b' },
  { token: '{{salary}}',     label: 'Salary',          color: '#ef4444' },
  { token: '{{doj}}',        label: 'Date of Joining', color: '#06b6d4' },
];

const SAMPLE = {
  '{{name}}':       'Jane Smith',
  '{{email}}':      'jane@example.com',
  '{{position}}':   'Backend Developer',
  '{{department}}': 'Engineering',
  '{{salary}}':     '800,000',
  '{{doj}}':        '01 September 2025',
};

const preview = (text) =>
  Object.entries(SAMPLE).reduce((t, [k, v]) => t.replaceAll(k, `<mark style="background:#fef9c3;padding:0 2px;border-radius:3px">${v}</mark>`), text || '');

const empty = { name: '', content: '' };

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [modal, setModal]         = useState(null);   // null | 'create' | templateObj
  const [form, setForm]           = useState(empty);
  const [tab, setTab]             = useState('write'); // 'write' | 'preview'
  const [error, setError]         = useState('');

  const load = () => api.get('/api/templates').then((r) => setTemplates(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setError(''); setTab('write'); setModal('create'); };
  const openEdit   = (t) => { setForm({ name: t.name, content: t.content }); setError(''); setTab('write'); setModal(t); };
  const close      = () => setModal(null);

  const insertToken = (token) => {
    setForm((f) => ({ ...f, content: f.content + token }));
  };

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
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.2rem' }}>
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>＋ New Template</button>
      </div>

      {/* HOW IT WORKS BANNER */}
      <div style={{
        background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.85rem', minWidth: 120 }}>💡 How it works</div>
        {['1. Give your template a name', '2. Write the offer letter body text', '3. Click variable chips to insert them', '4. Save → PDF is auto-generated with your company layout'].map((s, i) => (
          <div key={i} style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>{s.split('.')[0]}.</span>
            {s.split('.').slice(1).join('.')}
          </div>
        ))}
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

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 780, width: '95vw' }}>

            {/* HEADER */}
            <div className="modal-header">
              <h2>{modal === 'create' ? '📝 Create New Template' : '✏️ Edit Template'}</h2>
              <button className="modal-close" onClick={close}>✕</button>
            </div>

            {error && <div className="error">⚠️ {error}</div>}

            <form onSubmit={save}>

              {/* TEMPLATE NAME */}
              <label className="input-label">Template Name</label>
              <input
                placeholder="e.g. Software Engineer Offer Letter"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ marginBottom: 20 }}
              />

              {/* VARIABLE CHIPS */}
              <label className="input-label">Available Variables</label>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8, marginTop: -4 }}>
                Click a variable to insert it at the end of your content. These will be auto-filled with real candidate data when generating an offer.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {VARIABLES.map((v) => (
                  <button
                    key={v.token}
                    type="button"
                    onClick={() => insertToken(v.token)}
                    style={{
                      background: v.color + '15',
                      border: `1.5px solid ${v.color}40`,
                      color: v.color,
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{v.token}</span>
                    <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>→ {v.label}</span>
                  </button>
                ))}
              </div>

              {/* WRITE / PREVIEW TABS */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 8, borderBottom: '2px solid #e2e8f0' }}>
                {['write', 'preview'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    style={{
                      padding: '7px 20px',
                      border: 'none',
                      background: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      color: tab === t ? '#3b82f6' : '#94a3b8',
                      borderBottom: tab === t ? '2px solid #3b82f6' : '2px solid transparent',
                      marginBottom: -2,
                      textTransform: 'capitalize',
                    }}
                  >
                    {t === 'write' ? '✍️ Write' : '👁️ Preview'}
                  </button>
                ))}
              </div>

              {tab === 'write' ? (
                <>
                  <label className="input-label">Offer Letter Body</label>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 6, marginTop: -4 }}>
                    Write the body text of your offer letter. Use the variable chips above to insert dynamic fields.
                    The company logo, header, footer, signature lines, and watermark are added automatically.
                  </p>
                  <textarea
                    placeholder={`Example:\n\nWe are pleased to offer you the position of {{position}} in our {{department}} team.\n\nYour annual CTC will be ₹{{salary}} and your date of joining is {{doj}}.\n\nPlease confirm your acceptance within 7 days.`}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={10}
                    required
                    style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.7 }}
                  />
                </>
              ) : (
                <>
                  <label className="input-label">Preview (with sample data)</label>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '20px 24px',
                    minHeight: 200,
                    background: '#fafafa',
                    fontSize: '0.88rem',
                    lineHeight: 1.8,
                    color: '#1a1a1a',
                    whiteSpace: 'pre-wrap',
                  }}
                    dangerouslySetInnerHTML={{ __html: preview(form.content) || '<span style="color:#94a3b8">Nothing to preview yet. Write some content first.</span>' }}
                  />
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 8 }}>
                    ✅ Highlighted values show how the template will look with real candidate data.
                    The actual PDF will include company header, logo, footer, and signature lines automatically.
                  </p>
                </>
              )}

              <div className="modal-actions" style={{ marginTop: 20 }}>
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
