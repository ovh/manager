import { describe, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProjectRegions } from './useRegions';
import { getProjectRegions, TRegion } from '@/api/data/regions';

vi.mock('@/api/data/regions', () => ({
  getProjectRegions: vi.fn().mockResolvedValue([]),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useProjectRegions', () => {
  it('should return regions when data is available', async () => {
    vi.mocked(getProjectRegions).mockResolvedValue([
      { name: 'region1', services: [] },
      { name: 'region2', services: [] },
    ] as TRegion[]);

    const { result } = renderHook(() => useProjectRegions('mocked_projectId'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { name: 'region1', services: [] },
        { name: 'region2', services: [] },
      ]);
    });
  });

  it('should return undefined when data is not available', async () => {
    vi.mocked(getProjectRegions).mockResolvedValue(null);

    const { result } = renderHook(() => useProjectRegions('mocked_projectId'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
  });
});
