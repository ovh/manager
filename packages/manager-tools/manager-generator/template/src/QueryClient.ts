/**
 * queryClient.ts
 * -----------------------------------------------------------------------------
 * Centralized React Query client instance.
 *
 * Responsibilities:
 * - Configure global defaults for queries (e.g., caching, retries, refetching).
 * - Provide a single `QueryClient` shared across the app via `QueryClientProvider`.
 *
 * @remarks
 * - `staleTime = 300_000` (5 minutes) means cached data is considered fresh
 *   for 5 minutes before becoming “stale”. This reduces network calls for
 *   frequently accessed resources.
 * - Additional defaults (e.g., retry, refetchOnWindowFocus) can be configured here
 *   if needed by product requirements.
 */
import { QueryClient } from '@tanstack/react-query';

/**
 * Global query client instance with app-wide defaults.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /** Data stays fresh for 5 minutes */
      staleTime: 300_000,
    },
  },
});

export default queryClient;
