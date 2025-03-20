import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getBillingServices } from '@/data/api/billingServices';
import { HubBillingServices } from '@/billing/types/billingServices.type';

export const useFetchHubBillingServices = (
  options?: Partial<DefinedInitialDataOptions<HubBillingServices, AxiosError>>,
) =>
  useQuery<HubBillingServices, AxiosError>({
    ...options,
    queryKey: ['getHubBillingServices'],
    queryFn: getBillingServices,
    retry: 0,
  });
