import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '@/features/cart/store/cartStore';

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);
  const location = useLocation();
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }

    getCurrentUser(token)
      .then((user) => {
        if (active) {
          setUser(user);
          setVerifiedToken(token);
        }
      })
      .catch(() => {
        if (active) {
          logout();
          clearCart();
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      });

    return () => {
      active = false;
    };
  }, [token, setUser, logout, clearCart]);

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (verifiedToken !== token) return <p role="status">Đang kiểm tra phiên đăng nhập...</p>;
  return <Outlet />;
}
