import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
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

const ALL_NAV = [...NAV, ...ADMIN_NAV];

function getPageTitle(pathname) {
  const match = ALL_NAV.find((n) =>
    n.end ? pathname === n.to : pathname.startsWith(n.to)
  );
  return match?.label ?? 'OfferBuilder';
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initials = user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">📄</div>
          <div className="brand-text">
            <span className="brand-name">OfferBuilder</span>
            <span className="brand-tagline">HR Management</span>
          </div>
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
              <span className="sidebar-section-label" style={{ paddingTop: '1rem' }}>Admin</span>
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

      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <span className="header-page-title">{pageTitle}</span>
            <span className="header-breadcrumb">OfferBuilder / {pageTitle}</span>
          </div>
          <div className="header-right">
            <div className="header-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              {user?.role === 'admin' ? 'Admin' : 'HR'}
            </div>
            <div className="header-avatar" title={user?.name}>{initials}</div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
