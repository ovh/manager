import { QueryClient } from '@tanstack/react-query';

const MINUTES = 60 * 1000;
const DEFAULT_QUERIES_STALE_TIME = 5 * MINUTES;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERIES_STALE_TIME,
    },
  },
});
