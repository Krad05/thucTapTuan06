import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useCreateProduct, useProduct, useUpdateProduct } from '../hooks/useProducts';

export function ProductFormPage() {
  const { id } = useParams();
  const productId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(productId);
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const goHome = () => navigate('/');

  if (productId !== undefined && isLoading)
    return (
      <div className="state-card">
        <span className="spinner spinner-dark" /> Đang tải sản phẩm...
      </div>
    );
  if (productId !== undefined && (isError || !product)) {
    return (
      <div className="state-card state-error">
        <h3>Không tìm thấy sản phẩm</h3>
        <Link className="button button-secondary" to="/">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isEditing = productId !== undefined;
  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> WORKSPACE / SẢN PHẨM
          </div>
          <h1>{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
          <p className="page-description">
            {isEditing
              ? 'Cập nhật thông tin trong danh mục của bạn.'
              : 'Tạo một sản phẩm mới cho danh mục cửa hàng.'}
          </p>
        </div>
        <Link className="button button-secondary" to="/">
          ← Quay lại
        </Link>
      </section>
      <section className="form-card">
        <div className="form-card-heading">
          <span className="stat-icon stat-icon-violet">✦</span>
          <div>
            <h2>Thông tin cơ bản</h2>
            <p>Điền các thông tin cần thiết bên dưới.</p>
          </div>
        </div>
        <ProductForm
          initial={
            product ? { title: product.title, price: product.price } : { title: '', price: 0 }
          }
          submitting={create.isPending || update.isPending}
          onSubmit={(values) => {
            if (product) update.mutate({ id: product.id, ...values }, { onSuccess: goHome });
            else create.mutate(values, { onSuccess: goHome });
          }}
        />
        {(create.isError || update.isError) && (
          <p className="form-error" role="alert">
            Không thể lưu sản phẩm. Vui lòng thử lại.
          </p>
        )}
      </section>
    </div>
  );
}
