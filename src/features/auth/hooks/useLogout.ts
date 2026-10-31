import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useAuthStore } from '../store/authStore';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    logout();
    clearCart();
    queryClient.clear(); // xóa cache để không lộ dữ liệu của user cũ
    navigate('/login', { replace: true });
  };
}
