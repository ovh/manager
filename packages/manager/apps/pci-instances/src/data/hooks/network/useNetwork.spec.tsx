import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useNetwork } from './useNetwork';
import queryClient from '@/queryClient';
import { getNetwork } from '@/data/api/network';

const projectId = 'projectId-test';
const region = 'fake-region';

vi.mock('@/data/api/network');
vi.mocked(getNetwork).mockResolvedValue([]);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useNetwork', () => {
  it('should return correctly network detail', async () => {
    const { result } = renderHook(() => useNetwork(projectId, region), {
      wrapper,
    });

    expect(getNetwork).toHaveBeenCalledWith({
      projectId,
      region,
    });
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
