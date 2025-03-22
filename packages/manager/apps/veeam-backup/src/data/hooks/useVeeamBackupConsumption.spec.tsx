import React from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { renderHook, waitFor } from '@testing-library/react';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  ServiceDetails,
  useServiceDetailsQueryOption,
} from '@ovh-ux/manager-module-common-api';
import useVeeamBackupConsumption from './useVeeamBackupConsumption';
import { getServiceConsumption } from '@/data/api/service-consumption';
import { TServiceConsumption } from '@/type/service-consumption.type';

vi.mock('@ovh-ux/manager-react-components');
vi.mock('@/data/api/service-consumption');
vi.mock('@ovh-ux/manager-module-common-api');

describe('useVeeamBackupConsumption tests suite', () => {
  const resourceName = 'id-resource-veeam';
  const serviceId = 123;
  const consumptions = [
    { planCode: 'planCode1', quantity: 100, uniqueId: 'id' },
  ];
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => vi.clearAllMocks());

  it('Should compute service consumptions', async () => {
    vi.mocked(useServiceDetailsQueryOption).mockReturnValue({
      queryKey: ['services', 'details', resourceName] as any,
      queryFn: vi.fn(),
      retry: false,
      enabled: !!resourceName,
    });

    vi.spyOn(QueryClient.prototype, 'fetchQuery').mockResolvedValueOnce({
      data: { serviceId },
    } as AxiosResponse<ServiceDetails>);

    vi.mocked(getServiceConsumption).mockResolvedValueOnce({
      data: consumptions,
    } as ApiResponse<TServiceConsumption[]>);

    const { result } = renderHook(
      () => useVeeamBackupConsumption(resourceName),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    expect(vi.mocked(useServiceDetailsQueryOption)).toHaveBeenCalledWith({
      resourceName,
    });

    expect(QueryClient.prototype.fetchQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['services', 'details', resourceName],
      }),
    );

    await waitFor(() => {
      expect(vi.mocked(getServiceConsumption)).toHaveBeenCalledWith(
        serviceId,
        expect.any(AbortSignal),
      );
    });
    await waitFor(() => {
      expect(result.current.data).toEqual(consumptions);
    });
  });
});
