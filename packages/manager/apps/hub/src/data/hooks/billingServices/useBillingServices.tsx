import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getBillingServices } from '@/data/api/billingServices';
import { HubBillingServices } from '@/billing/types/billingServices.type';

export const useFetchHubBillingServices = () =>
  useQuery<HubBillingServices, AxiosError>({
    queryKey: ['getHubBillingServices'],
    queryFn: getBillingServices,
    retry: 0,
  });
