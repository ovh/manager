import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      retry: 2,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
