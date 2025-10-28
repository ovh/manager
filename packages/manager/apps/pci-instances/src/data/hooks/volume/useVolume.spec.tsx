import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useVolumes } from './useVolume';
import queryClient from '@/queryClient';
import { getVolumes } from '@/data/api/volume';

const projectId = 'projectId-test';
const region = 'fake-region';

vi.mock('@/data/api/volume');
vi.mocked(getVolumes).mockResolvedValue([]);

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useVolumes', () => {
  it('should return correctly volumes details', async () => {
    const { result } = renderHook(() => useVolumes(projectId, region), {
      wrapper,
    });

    expect(getVolumes).toHaveBeenCalledWith({
      projectId,
      region,
    });
    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
