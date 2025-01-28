import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useFeatureAvailability } from './useFeatureAvailability';

const wrapper = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@ovh-ux/manager-core-api', () => ({
  apiClient: {
    aapi: {
      get: vi.fn(),
    },
  },
}));

describe('useFeatureAvailability', () => {
  it('should fetch data if no options is given', () => {
    const { result } = renderHook(() => useFeatureAvailability(['test']), {
      wrapper,
    });
    expect(result.current?.isFetching).toBe(true);
  });

  it('should not fetch data if enabled option is false', () => {
    const { result } = renderHook(
      () => useFeatureAvailability(['test'], { enabled: false }),
      {
        wrapper,
      },
    );
    expect(result.current?.isFetching).toBe(false);
  });
});
