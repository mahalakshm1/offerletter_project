import { useEffect, useState } from 'react';
import api from '../api';

const METHOD_CLASS = { POST: 'method-POST', PUT: 'method-PUT', PATCH: 'method-PATCH', DELETE: 'method-DELETE' };

export default function AuditLogs() {
  const [data, setData] = useState({ logs: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);

  const load = (p = 1) => api.get(`/api/logs?page=${p}&limit=20`).then((r) => setData(r.data));
  useEffect(() => { load(page); }, [page]);

  return (
    <div>
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p>{data.total} total log entries</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>User</th><th>Method</th><th>Route</th><th>Resource ID</th><th>IP</th><th>Time</th></tr>
          </thead>
          <tbody>
            {data.logs.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">🗂️</div><p>No audit logs yet.</p></div></td></tr>
            )}
            {data.logs.map((l) => (
              <tr key={l.id}>
                <td style={{ color: '#475569' }}>{l.user_email}</td>
                <td><span className={`method ${METHOD_CLASS[l.method] || ''}`}>{l.method}</span></td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#334155' }}>{l.route}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#94a3b8', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.resource_id || '—'}</td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{l.ip}</td>
                <td style={{ color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
        <span>Page {page} of {data.pages}</span>
        <button className="btn btn-ghost btn-sm" disabled={page === data.pages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
}
