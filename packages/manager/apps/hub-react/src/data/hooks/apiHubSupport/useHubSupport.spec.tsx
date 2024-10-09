import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { describe, it, vi } from 'vitest';
import { useFetchHubSupport } from '@/data/hooks/apiHubSupport/useHubSupport';
import { SupportDataResponse } from '@/types/support.type';
import * as hubSupportApi from '@/data/api/apiHubSupport';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubSupport', () => {
  it('useFetchHubSupport should return expected result', async () => {
    const supportDataResponse: SupportDataResponse = {
      count: 3,
      data: [],
    };
    const getHubSupport = vi
      .spyOn(hubSupportApi, 'getHubSupport')
      .mockReturnValue(new Promise((resolve) => resolve(supportDataResponse)));

    const { result } = renderHook(() => useFetchHubSupport(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getHubSupport).toHaveBeenCalled();
      expect(result.current.data.count).toEqual(supportDataResponse.count);
      expect(result.current.data.data).toEqual(supportDataResponse.data);
    });
  });
});
