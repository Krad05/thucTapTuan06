import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> WORKSPACE / GIỎ HÀNG
          </div>
          <h1>Giỏ hàng</h1>
          <p className="page-description">Xem lại những sản phẩm bạn đã chọn.</p>
        </div>
        {items.length > 0 && (
          <button className="button button-quiet" onClick={clear}>
            Xóa toàn bộ
          </button>
        )}
      </section>

      {items.length === 0 ? (
        <div className="state-card cart-empty">
          <span className="state-icon">◇</span>
          <h3>Giỏ hàng đang trống</h3>
          <p>Khám phá danh mục và thêm sản phẩm bạn yêu thích.</p>
          <Link className="button button-primary" to="/">
            Khám phá sản phẩm <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            <div className="cart-items-heading">
              <strong>Sản phẩm đã chọn</strong>
              <span>{items.reduce((sum, item) => sum + item.qty, 0)} món</span>
            </div>
            {items.map((item, index) => (
              <article className="cart-row" key={item.id}>
                <div className={`cart-art product-art-${index % 4}`}>
                  <span>{['◈', '✳', '◉', '⌘'][index % 4]}</span>
                </div>
                <div className="cart-product-info">
                  <span className="product-category">SẢN PHẨM</span>
                  <strong>{item.title}</strong>
                  <div className="quantity-control" aria-label={`Số lượng ${item.title}`}>
                    <button
                      className="quantity-button"
                      onClick={() => decrement(item.id)}
                      aria-label={`Giảm số lượng ${item.title}`}
                      title={item.qty === 1 ? 'Bỏ sản phẩm khỏi giỏ' : 'Giảm số lượng'}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.qty}</span>
                    <button
                      className="quantity-button"
                      onClick={() => add({ id: item.id, title: item.title, price: item.price })}
                      aria-label={`Tăng số lượng ${item.title}`}
                      title="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                </div>
                <strong className="cart-line-total">{money.format(item.price * item.qty)}</strong>
                <button
                  className="icon-button remove-button"
                  onClick={() => remove(item.id)}
                  aria-label={`Bỏ ${item.title} khỏi giỏ hàng`}
                  title="Xóa mặt hàng"
                >
                  ×
                </button>
              </article>
            ))}
          </section>
          <aside className="order-summary">
            <span className="product-category">TÓM TẮT</span>
            <h2>Giá trị giỏ hàng</h2>
            <div className="summary-line">
              <span>Tạm tính</span>
              <strong>{money.format(total)}</strong>
            </div>
            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <strong className="free-shipping">Chưa áp dụng</strong>
            </div>
            <div className="summary-divider" />
            <div className="summary-line summary-total">
              <span>Tổng cộng</span>
              <strong>{money.format(total)}</strong>
            </div>
            <div className="checkout-note">Đây là giỏ hàng thực hành, chưa có bước thanh toán.</div>
            <Link to="/" className="button button-primary checkout-button">
              Tiếp tục chọn sản phẩm <span>→</span>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
