import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { usePrivateNetworks } from '../usePrivateNetworks';
import {
  mockedPrivateNetworkDTO,
  mockedProjectId,
  mockedPrivateNetworkEntity,
} from '@/__mocks__/instance/constants';

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

afterEach(() => {
  vi.clearAllMocks();
});

describe('usePrivateNetworks', () => {
  it('Should return expected private network data', async () => {
    vi.spyOn(v6, 'get').mockResolvedValueOnce({
      data: mockedPrivateNetworkDTO,
    });

    const { result } = renderHook(
      () => usePrivateNetworks({ select: (data) => data }),
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${mockedProjectId}/aggregated/network`,
    );

    expect(result.current.isPending).toBeTruthy();
    await waitFor(() =>
      expect(result.current.data).toStrictEqual(mockedPrivateNetworkEntity),
    );
  });
});
