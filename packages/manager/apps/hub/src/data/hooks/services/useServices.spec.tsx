import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import * as ServicesApi from '@/data/api/services';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubServices', () => {
  it('returns capsule even if api returned no services', async () => {
    const services = {
      data: [],
      count: 0,
    };
    const getServices = vi
      .spyOn(ServicesApi, 'getServices')
      .mockReturnValue(services);

    const { result } = renderHook(() => useFetchHubServices(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getServices).toHaveBeenCalled();
      expect(result.current.data).toEqual(services);
    });
  });
});
