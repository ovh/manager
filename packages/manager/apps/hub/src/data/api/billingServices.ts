import { aapi } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import {
  BillingService,
  BillingServicesData,
  HubBillingServices,
} from '@/types/billingServices.type';

export const getBillingServices: () => Promise<
  HubBillingServices
> = async () => {
  const { data } = await aapi.get<AxiosResponse<BillingServicesData>>(
    `/hub/billingServices`,
  );
  const services = data.data?.billingServices;
  // The returned value when status is 'ERROR' has changed in order to keep a standard return type
  // for this hook, also this give the same result as previous code without the confusing part
  return services.status === 'ERROR'
    ? {
        count: 0,
        services: [],
      }
    : {
        count: services?.data?.count,
        services:
          services?.data?.data?.map((service) => new BillingService(service)) ||
          [],
      };
};
