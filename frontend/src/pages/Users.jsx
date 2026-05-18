import { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/api/users').then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await api.put(`/api/users/${id}`, { role }); load();
  };

  const del = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await api.delete(`/api/users/${id}`); load(); }
    catch (err) { alert(err.response?.data?.message || 'Cannot delete user'); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage HR and Admin accounts</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🔑</div><p>No users found.</p></div></td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {u.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <strong style={{ color: '#0f172a' }}>{u.name}</strong>
                  </div>
                </td>
                <td style={{ color: '#64748b' }}>{u.email}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    style={{ padding: '0.28rem 0.5rem', fontSize: '0.78rem', marginBottom: 0, width: 'auto', borderRadius: '6px' }}
                  >
                    <option value="hr">hr</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ color: '#64748b' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => del(u.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
