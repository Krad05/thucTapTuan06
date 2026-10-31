import { authClient } from '@/shared/lib/axios';
import type { LoginPayload, User } from '../types';

export async function getCurrentUser(accessToken: string): Promise<User> {
  const { data } = await authClient.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    role: data.role,
  };
}

export async function login(payload: LoginPayload) {
  const { data } = await authClient.post<{ accessToken: string }>('/auth/login', payload);
  const user = await getCurrentUser(data.accessToken);
  return { accessToken: data.accessToken, user };
}
