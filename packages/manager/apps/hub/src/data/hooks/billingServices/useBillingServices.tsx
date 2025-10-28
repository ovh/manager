import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { HubBillingServices } from '@/billing/types/billingServices.type';
import { getBillingServices } from '@/data/api/billingServices';

export const useFetchHubBillingServices = (
  options?: Partial<DefinedInitialDataOptions<HubBillingServices, AxiosError>>,
) =>
  useQuery<HubBillingServices, AxiosError>({
    ...options,
    queryKey: ['getHubBillingServices'],
    queryFn: getBillingServices,
    retry: 0,
  });
