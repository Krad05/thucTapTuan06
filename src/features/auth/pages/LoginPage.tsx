import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const token = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
  const [username, setUsername] = useState('adrian');
  const [password, setPassword] = useState('adrian05');
  const { mutate, isPending, isError } = useLogin();

  if (token) return <Navigate to={from} replace />;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate({ username, password });
  };

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand">
          <span className="brand-mark">A</span>
          <strong>Adrian</strong>
        </div>
        <div className="login-story-content">
          <span className="login-kicker">
            <span /> WORKSPACE QUẢN LÝ SẢN PHẨM
          </span>
          <h1>
            Một không gian
            <br />
            gọn gàng cho
            <br />
            <em>ý tưởng lớn.</em>
          </h1>
          <p>Quản lý sản phẩm, theo dõi danh mục và sắp xếp mọi thứ theo cách của bạn.</p>
        </div>
        <div className="login-story-bottom">
          <span>© 2026 Adrian Product Studio</span>
          <span>Đơn giản · Tập trung · Hiệu quả</span>
        </div>
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
      </section>
      <section className="login-panel">
        <div className="login-panel-inner">
          <span className="login-mobile-brand">
            <span className="brand-mark">A</span> Adrian
          </span>
          <div className="login-form-heading">
            <span className="eyebrow">
              <span className="eyebrow-line" /> CHÀO MỪNG TRỞ LẠI
            </span>
            <h2>Đăng nhập</h2>
            <p>Nhập thông tin để vào không gian làm việc của bạn.</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
            {isError && (
              <p className="login-error" role="alert">
                <span>!</span> Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.
              </p>
            )}
            <button
              className="button button-primary login-submit"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner" /> Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập <span>→</span>
                </>
              )}
            </button>
          </form>
          <div className="login-security">
            <span>♢</span>
            <p>Phiên được xác minh trước khi mở khu vực quản lý.</p>
          </div>
        </div>
        <span className="login-corner-note">ADRIAN / YOUR WORKSPACE</span>
      </section>
    </main>
  );
}
