import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './queryClient';
import { router } from './router';

export function App() {
  useEffect(() => {
    const clearPrivateCache = () => queryClient.clear();
    window.addEventListener('auth:unauthorized', clearPrivateCache);
    return () => window.removeEventListener('auth:unauthorized', clearPrivateCache);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
