import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false, // No automatic retry (handled by components)
      refetchOnWindowFocus: false, // Avoid unnecessary refetch
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
