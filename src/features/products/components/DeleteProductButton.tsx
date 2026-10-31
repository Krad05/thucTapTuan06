import { withPermission } from '@/features/auth';
import { Modal } from '@/shared/components/Modal';
import { useDeleteProduct } from '../hooks/useProducts';
import type { Product } from '../types';

interface Props {
  product: Product;
}

function BaseDeleteButton({ product }: Props) {
  const { mutate, isPending, isError } = useDeleteProduct();

  return (
    <Modal>
      <Modal.Trigger>
        <button className="button button-small button-quiet">Xóa</button>
      </Modal.Trigger>
      <Modal.Content>
        <div className="modal-icon">!</div>
        <h3 id={`delete-title-${product.id}`}>Xóa sản phẩm?</h3>
        <p>Bạn có chắc muốn xóa “{product.title}”? Thao tác này không thể hoàn tác.</p>
        {isError && (
          <p className="form-error" role="alert">
            Không thể xóa sản phẩm. Hãy thử lại.
          </p>
        )}
        <div className="modal-actions">
          <Modal.Close>
            <button className="button button-secondary">Giữ lại</button>
          </Modal.Close>
          <Modal.Close onClick={(close) => mutate(product.id, { onSuccess: close })}>
            <button className="button button-danger" disabled={isPending}>
              {isPending ? 'Đang xóa...' : 'Xóa sản phẩm'}
            </button>
          </Modal.Close>
        </div>
      </Modal.Content>
    </Modal>
  );
}

const GuardedDeleteButton = withPermission(BaseDeleteButton, 'product:delete');

export function DeleteProductButton(props: Props) {
  return <GuardedDeleteButton {...props} />;
}
