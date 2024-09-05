import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import * as ServicesApi from '@/data/api/services';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { Services } from '@/types/services.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubServices', () => {
  it('returns capsule even if api returned no services', async () => {
    const services: ApiEnvelope<Services> = {
      data: {
        data: {},
        count: 0,
      },
      status: 'OK',
    };
    const getServices = vi
      .spyOn(ServicesApi, 'getServices')
      .mockReturnValue(new Promise((resolve) => resolve(services)));

    const { result } = renderHook(() => useFetchHubServices(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getServices).toHaveBeenCalled();
      expect(result.current.data).toEqual(services);
    });
  });
});
