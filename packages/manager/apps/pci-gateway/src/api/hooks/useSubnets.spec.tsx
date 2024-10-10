import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useSubnets } from './useSubnets';
import { getSubnets, getSubnetsUrl, TSubnet } from '@/api/data/subnets';

vi.mock('@/api/data/subnets', () => ({
  getSubnets: vi.fn(),
  getSubnetsUrl: vi.fn(),
}));

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useSubnets', () => {
  it('returns empty array when networkId is "new"', async () => {
    vi.mocked(getSubnetsUrl).mockReturnValue('mocked_subnetUrl');
    const { result } = renderHook(() => useSubnets('test', 'test', 'new'), {
      wrapper,
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual([]);
  });

  it('calls getSubnets when networkId is not "new"', async () => {
    vi.mocked(getSubnetsUrl).mockReturnValue('mocked_subnetUrl');
    vi.mocked(getSubnets).mockResolvedValueOnce(([
      { id: '1', name: 'test' },
    ] as unknown) as TSubnet[]);
    const { result } = renderHook(() => useSubnets('test', 'test', '1'), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.data).toEqual([{ id: '1', name: 'test' }]),
    );
    expect(getSubnets).toHaveBeenCalledWith('test', 'test', '1');
  });
});
