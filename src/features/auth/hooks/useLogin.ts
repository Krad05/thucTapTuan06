import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ user, accessToken }) => {
      queryClient.clear();
      setSession(user, accessToken);
    },
  });
}
