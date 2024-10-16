import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInactiveRegions } from './useInactiveRegions';
import { getInactiveRegions, TInactiveRegion } from '@/api/data/regions';

const client = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

vi.mock('@/api/data/regions', () => ({
  getInactiveRegions: vi.fn().mockResolvedValue([]),
  getInactiveRegionsUrl: vi.fn().mockReturnValue('inactiveRegionsUrl'),
}));

describe('useInactiveRegions', () => {
  it('useInactiveRegions returns inactive regions when project id is present', async () => {
    const mockInactiveRegions = ([
      { id: 'region1' },
      { id: 'region2' },
    ] as unknown) as TInactiveRegion[];

    vi.mocked(getInactiveRegions).mockResolvedValue(mockInactiveRegions);

    const { result } = renderHook(() => useInactiveRegions('projectId'), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.data).toEqual(mockInactiveRegions),
    );
  });

  it('useInactiveRegions returns error when fetching inactive regions fails', () => {
    const mockError = new Error('Failed to fetch inactive regions');

    vi.mocked(getInactiveRegions).mockRejectedValue(mockError);

    const { result } = renderHook(() => useInactiveRegions('projectId'), {
      wrapper,
    });
    waitFor(() => expect(result.current.error).toEqual(mockError));
  });
});
