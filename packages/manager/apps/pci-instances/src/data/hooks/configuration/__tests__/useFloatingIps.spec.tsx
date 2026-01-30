import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { useFloatingIps } from '../useFloatingIps';
import {
  mockedFloatingIpDTO,
  mockedFloatingIpEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const regionName = 'SBG';

afterEach(() => {
  vi.clearAllMocks();
});

describe('useFloatingIps', () => {
  it('Should return expected floating IP data', async () => {
    vi.spyOn(v6, 'get').mockResolvedValueOnce({
      data: mockedFloatingIpDTO,
    });

    const { result } = renderHook(
      () =>
        useFloatingIps({
          regionName,
          select: (data) => data,
        }),
      { wrapper },
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${mockedProjectId}/region/${regionName}/floatingip`,
    );

    expect(result.current.isPending).toBeTruthy();
    await waitFor(() =>
      expect(result.current.data).toStrictEqual(mockedFloatingIpEntity),
    );
  });
});
