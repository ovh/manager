import React from 'react';
import { vi } from 'vitest';
import { useServiceDetails } from '@ovh-ux/manager-react-components';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '@ovh-ux/manager-module-common-api';
import useVeeamBackupConsumption from './useVeeamBackupConsumption';
import { getServiceConsumption } from '@/data/api/service-consumption';
import { TServiceConsumption } from '@/type/service-consumption.type';

vi.mock('@ovh-ux/manager-react-components');
vi.mock('@/data/api/service-consumption');

describe('useVeeamBackupConsumption tests suite', () => {
  const resourceName = 'id-resource-veeam';
  const serviceId = 123;
  const consumptions = [
    { planCode: 'planCode1', quantity: 100, uniqueId: 'id' },
  ];

  afterEach(() => vi.clearAllMocks());

  it('Should compute service consumptions', async () => {
    vi.mocked(useServiceDetails).mockReturnValue({
      data: {
        data: {
          serviceId,
        },
      },
    } as UseQueryResult<ApiResponse<ServiceDetails>, ApiError>);

    vi.mocked(getServiceConsumption).mockResolvedValueOnce({
      data: consumptions,
    } as ApiResponse<TServiceConsumption[]>);

    const { result } = renderHook(
      () => useVeeamBackupConsumption(resourceName),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={new QueryClient()}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    expect(vi.mocked(useServiceDetails)).toHaveBeenCalledWith({ resourceName });
    expect(vi.mocked(getServiceConsumption)).toHaveBeenCalledWith(
      serviceId,
      expect.any(AbortSignal),
    );
    await waitFor(() => {
      expect(result.current.data).toEqual(consumptions);
    });
  });
});
