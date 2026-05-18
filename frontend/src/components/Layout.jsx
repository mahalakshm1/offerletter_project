import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Layout.css';

const NAV = [
  { to: '/',           icon: '📊', label: 'Dashboard',  end: true },
  { to: '/templates',  icon: '📝', label: 'Templates' },
  { to: '/candidates', icon: '👥', label: 'Candidates' },
  { to: '/offers',     icon: '📄', label: 'Offers' },
];
const ADMIN_NAV = [
  { to: '/users', icon: '🔑', label: 'Users' },
  { to: '/logs',  icon: '🗂️', label: 'Audit Logs' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">📄</div>
          OfferBuilder
        </div>

        <span className="sidebar-section-label">Main Menu</span>
        <nav>
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}>
              <span className="nav-icon">{icon}</span>{label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <span className="sidebar-section-label" style={{ marginTop: '0.75rem' }}>Admin</span>
              {ADMIN_NAV.map(({ to, icon, label }) => (
                <NavLink key={to} to={to}>
                  <span className="nav-icon">{icon}</span>{label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={() => { logout(); navigate('/login'); }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
