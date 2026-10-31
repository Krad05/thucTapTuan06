import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div className="state-card forbidden-card">
      <span className="state-icon">403</span>
      <div className="eyebrow">
        <span className="eyebrow-line" /> KHÔNG ĐỦ QUYỀN
      </div>
      <h1>Bạn chưa thể vào đây</h1>
      <p>Tài khoản hiện tại không có quyền truy cập trang này.</p>
      <Link className="button button-primary" to="/">
        Về trang sản phẩm <span>→</span>
      </Link>
    </div>
  );
}
