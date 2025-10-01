import React, { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { HubBillingServices } from '@/billing/types/billingServices.type';
import * as BillingServicesApi from '@/data/api/billingServices';
import { useFetchHubBillingServices } from '@/data/hooks/billingServices/useBillingServices';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubBillingServices', () => {
  it('returns capsule even if api returned no services', async () => {
    const services: HubBillingServices = {
      services: [],
      count: 0,
    };
    const getServices = vi
      .spyOn(BillingServicesApi, 'getBillingServices')
      .mockReturnValue(new Promise((resolve) => resolve(services)));

    const { result } = renderHook(() => useFetchHubBillingServices(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getServices).toHaveBeenCalled();
      expect(result.current.data).toEqual(services);
    });
  });
});
