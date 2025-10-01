import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as ServicesApi from '@/data/api/services';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubServices', () => {
  it('returns capsule even if api returned no services', async () => {
    const services: ApiEnvelope<ProductList> = {
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
