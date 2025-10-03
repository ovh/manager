import { PropsWithChildren } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as hubSupportApi from '@/data/api/apiHubSupport';
import { useFetchHubSupport } from '@/data/hooks/apiHubSupport/useHubSupport';
import queryClient from '@/queryClient';
import { SupportResponse } from '@/types/support.type';

const supportDataResponse: SupportResponse = {
  support: {
    data: {
      count: 3,
      data: [],
    },
    status: 'OK',
  },
};

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubSupport', () => {
  it('should return expected result', async () => {
    const getHubSupport = vi.spyOn(hubSupportApi, 'getHubSupport').mockReturnValue(
      Promise.resolve({
        data: supportDataResponse,
        status: 'OK',
      }),
    );

    const { result } = renderHook(() => useFetchHubSupport(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getHubSupport).toHaveBeenCalled();
      expect(result.current.data.count).toEqual(supportDataResponse.support.data.count);
      expect(result.current.data.data).toEqual(supportDataResponse.support.data.data);
    });
  });
  it('should call API without cache when refetching', async () => {
    const getHubSupport = vi.spyOn(hubSupportApi, 'getHubSupport').mockReturnValue(
      Promise.resolve({
        data: supportDataResponse,
        status: 'OK',
      }),
    );

    const { result } = renderHook(() => useFetchHubSupport(), {
      wrapper,
    });
    getHubSupport.mockReset();
    await act(() => result.current.refetch());

    await waitFor(() => {
      expect(getHubSupport).toHaveBeenCalledWith(false);
    });
  });
});
