import { useEffect, useState } from 'react';
import api from '../api';

const STAT_META = [
  { key: 'total',           label: 'Total Offers',   icon: '📄', color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
  { key: 'totalCandidates', label: 'Candidates',      icon: '👥', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  { key: 'accepted',        label: 'Accepted',        icon: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  { key: 'rejected',        label: 'Rejected',        icon: '❌', color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  { key: 'sent',            label: 'Sent',            icon: '📨', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { key: 'acceptanceRate',  label: 'Acceptance Rate', icon: '📈', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [byStatus, setByStatus] = useState([]);
  const [byDept, setByDept]     = useState([]);
  const [loading, setLoading]   = useState(false);

  const load = async () => {
    setLoading(true);
    await Promise.all([
      api.get('/api/analytics/overview').then((r) => setOverview(r.data)),
      api.get('/api/analytics/by-status').then((r) => setByStatus(r.data)),
      api.get('/api/analytics/by-department').then((r) => setByDept(r.data)),
    ]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const maxStatus = Math.max(...byStatus.map((s) => Number(s.count)), 1);
  const maxDept   = Math.max(...byDept.map((d) => Number(d.count)), 1);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your offer letter activity</p>
      </div>

      {overview && (
        <div className="stats-grid">
          {STAT_META.map(({ key, label, icon, color, bg }) => (
            <div className="stat-card" key={key}>
              <div className="stat-card-accent" style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
              <div className="stat-icon-wrap" style={{ background: bg }}>
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
              </div>
              <div className="label">{label}</div>
              <div className="value" style={{ color }}>{overview[key] ?? '—'}</div>
            </div>
          ))}
        </div>
      )}

      <div className="chart-row">
        <div className="card">
          <div className="card-title">📊 Offers by Status</div>
          {byStatus.length === 0
            ? <div className="empty-state"><div className="empty-icon">📊</div><p>No data yet</p></div>
            : byStatus.map((s) => (
              <div className="chart-item" key={s.status}>
                <span className={`badge badge-${s.status}`} style={{ minWidth: '80px', justifyContent: 'center' }}>{s.status}</span>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ width: `${(Number(s.count) / maxStatus) * 100}%` }} />
                </div>
                <strong style={{ fontSize: '0.855rem', color: '#334155', minWidth: '28px', textAlign: 'right' }}>{s.count}</strong>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="card-title">🏢 Offers by Department</div>
          {byDept.length === 0
            ? <div className="empty-state"><div className="empty-icon">🏢</div><p>No data yet</p></div>
            : byDept.map((d) => (
              <div className="chart-item" key={d.department}>
                <span style={{ fontSize: '0.835rem', color: '#475569', minWidth: '90px', fontWeight: 500 }}>{d.department || '—'}</span>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ width: `${(Number(d.count) / maxDept) * 100}%`, background: 'linear-gradient(90deg,#10b981,#3b82f6)' }} />
                </div>
                <strong style={{ fontSize: '0.855rem', color: '#334155', minWidth: '28px', textAlign: 'right' }}>{d.count}</strong>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
