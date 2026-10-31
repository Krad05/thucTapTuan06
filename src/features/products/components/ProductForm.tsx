import { useState, type FormEvent } from 'react';
import type { ProductInput } from '../types';

interface Props {
  initial: ProductInput;
  submitting: boolean;
  onSubmit: (values: ProductInput) => void;
}

export function ProductForm({ initial, submitting, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(String(initial.price));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle || Number(price) < 0 || !Number.isFinite(Number(price))) return;
    onSubmit({ title: normalizedTitle, price: Number(price) });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label htmlFor="product-title">Tên sản phẩm</label>
      <input
        id="product-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Ví dụ: Tai nghe không dây"
        required
      />
      <span className="field-hint">Tên rõ ràng giúp khách hàng dễ tìm sản phẩm.</span>
      <label htmlFor="product-price">Giá bán (USD)</label>
      <div className="price-input-wrap">
        <span>$</span>
        <input
          id="product-price"
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
}
