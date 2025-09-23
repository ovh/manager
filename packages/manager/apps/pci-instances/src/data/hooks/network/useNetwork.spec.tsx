import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useNetworks, useReverseDns } from './useNetwork';
import queryClient from '@/queryClient';
import { getNetworks, getReverseDns } from '@/data/api/network';

const projectId = 'projectId-test';
const region = 'fake-region';
const fakeIp = 'fake-ip';

vi.mock('@/data/api/network');
vi.mocked(getNetworks).mockResolvedValue([]);
vi.mocked(getReverseDns).mockResolvedValue([]);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useNetwork', () => {
  it('should return correctly network detail', async () => {
    const { result } = renderHook(() => useNetworks(projectId, region), {
      wrapper,
    });

    expect(getNetworks).toHaveBeenCalledWith({
      projectId,
      region,
    });
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useReverseDns', () => {
  it('should call correctly dns api', async () => {
    const { result } = renderHook(() => useReverseDns(fakeIp), {
      wrapper,
    });

    expect(getReverseDns).toHaveBeenCalledWith(fakeIp);
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
