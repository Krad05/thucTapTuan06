import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore, useLogout } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { can } from '@/shared/permissions';

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const count = useCartStore((s) => s.items.reduce((sum, item) => sum + item.qty, 0));
  const logout = useLogout();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">A</span>
          <span>
            <strong>Adrian</strong>
            <small>PRODUCT STUDIO</small>
          </span>
        </NavLink>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">▦</span>
            <span>Sản phẩm</span>
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">◇</span>
            <span>Giỏ hàng</span>
            {count > 0 && <span className="nav-count">{count}</span>}
          </NavLink>
          {can(user?.role, 'product:create') && (
            <NavLink
              to="/products/new"
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <span className="nav-icon">＋</span>
              <span>Thêm sản phẩm</span>
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="avatar">{user?.firstName?.slice(0, 1) ?? 'U'}</span>
            <span className="user-meta">
              <strong>{user?.firstName ?? user?.username}</strong>
              <small>{user?.role}</small>
            </span>
            <button
              className="icon-button logout-button"
              onClick={logout}
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              ↗
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>Quản lý cửa hàng</strong>
          </div>
          <div className="topbar-actions">
            <span className="status-dot" />
            <span className="online-label">Đang hoạt động</span>
            <span className="topbar-divider" />
            <span className="topbar-avatar">{user?.firstName?.slice(0, 1) ?? 'U'}</span>
            <button className="topbar-logout" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
