import { vi } from 'vitest';

vitest.mock('../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));
