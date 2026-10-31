import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { can } from '@/shared/permissions';
import { DeleteProductButton } from '../components/DeleteProductButton';
import { useProducts } from '../hooks/useProducts';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const productMarks = ['◈', '✳', '◉', '⌘', '◇', '✦'];

export function ProductListPage() {
  const { data, isLoading, isError, refetch, isFetching } = useProducts();
  const role = useAuthStore((s) => s.user?.role);
  const addToCart = useCartStore((s) => s.add);
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.qty, 0));
  const [search, setSearch] = useState('');
  const filteredProducts = useMemo(
    () =>
      (data ?? []).filter((product) =>
        product.title.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [data, search],
  );
  const totalValue = (data ?? []).reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> TỔNG QUAN CỬA HÀNG
          </div>
          <h1>Sản phẩm</h1>
          <p className="page-description">Theo dõi danh mục và quản lý sản phẩm của bạn.</p>
        </div>
        {can(role, 'product:create') && (
          <Link className="button button-primary" to="/products/new">
            <span>＋</span> Thêm sản phẩm
          </Link>
        )}
      </section>

      <section className="stats-grid" aria-label="Tổng quan sản phẩm">
        <article className="stat-card">
          <span className="stat-icon stat-icon-violet">▦</span>
          <div>
            <span className="stat-label">Tổng sản phẩm</span>
            <strong className="stat-value">{isLoading ? '—' : (data?.length ?? 0)}</strong>
          </div>
          <span className="stat-note">Trong danh mục</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-green">↗</span>
          <div>
            <span className="stat-label">Tổng giá trị</span>
            <strong className="stat-value">{isLoading ? '—' : money.format(totalValue)}</strong>
          </div>
          <span className="stat-note">Cộng giá niêm yết</span>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-orange">◇</span>
          <div>
            <span className="stat-label">Trong giỏ hàng</span>
            <strong className="stat-value">{cartCount}</strong>
          </div>
          <Link className="stat-link" to="/cart">
            Xem giỏ hàng <span>→</span>
          </Link>
        </article>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <h2>Danh mục sản phẩm</h2>
            <p>{data?.length ?? 0} sản phẩm trong cửa hàng</p>
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm sản phẩm..."
              aria-label="Tìm sản phẩm"
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Xóa tìm kiếm"
              >
                ×
              </button>
            )}
          </label>
        </div>

        {isLoading ? (
          <div className="product-grid" aria-label="Đang tải sản phẩm">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="product-skeleton" key={index} />
            ))}
          </div>
        ) : isError || !data ? (
          <div className="state-card state-error">
            <span className="state-icon">!</span>
            <h3>Chưa thể tải sản phẩm</h3>
            <p>Kiểm tra API sản phẩm đã chạy chưa, sau đó thử lại.</p>
            <button className="button button-secondary" onClick={() => refetch()}>
              Thử lại
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="state-card">
            <span className="state-icon">⌕</span>
            <h3>{search ? 'Không tìm thấy sản phẩm' : 'Danh mục đang trống'}</h3>
            <p>
              {search ? 'Thử từ khóa khác để tìm sản phẩm.' : 'Thêm sản phẩm đầu tiên để bắt đầu.'}
            </p>
            {search && (
              <button className="button button-secondary" onClick={() => setSearch('')}>
                Xóa tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className={`product-art product-art-${index % 4}`}>
                  <span className="product-art-mark">
                    {productMarks[index % productMarks.length]}
                  </span>
                  <span className="product-art-label">
                    ADRIAN / {String(product.id).padStart(3, '0')}
                  </span>
                  <span className="product-status">
                    <span /> Đang bán
                  </span>
                </div>
                <div className="product-card-body">
                  <div className="product-card-heading">
                    <div>
                      <span className="product-category">BỘ SƯU TẬP</span>
                      <h3>{product.title}</h3>
                    </div>
                  </div>
                  <div className="product-card-bottom">
                    <strong className="product-price">{money.format(product.price)}</strong>
                    <div className="product-actions">
                      {can(role, 'product:update') && (
                        <Link
                          className="button button-small button-secondary"
                          to={`/products/${product.id}/edit`}
                        >
                          Sửa
                        </Link>
                      )}
                      {can(role, 'product:delete') && <DeleteProductButton product={product} />}
                      <button
                        className="button button-small button-dark"
                        disabled={isFetching}
                        onClick={() =>
                          addToCart({ id: product.id, title: product.title, price: product.price })
                        }
                      >
                        <span>＋</span> Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
