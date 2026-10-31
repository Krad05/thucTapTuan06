import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (product: Omit<CartItem, 'qty'>) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((state) => {
          const found = state.items.find((item) => item.id === product.id);
          return {
            items: found
              ? state.items.map((item) =>
                  item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
                )
              : [...state.items, { ...product, qty: 1 }],
          };
        }),
      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter((item) => item.qty > 0),
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'cart' },
  ),
);
