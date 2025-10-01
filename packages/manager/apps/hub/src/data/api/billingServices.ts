import { AxiosResponse } from 'axios';

import { aapi, v6 } from '@ovh-ux/manager-core-api';

import {
  BillingService,
  BillingServicesData,
  HubBillingServices,
} from '@/billing/types/billingServices.type';

export const getBillingServices: () => Promise<HubBillingServices> = async () => {
  const { data } = await aapi.get<AxiosResponse<BillingServicesData>>(`/hub/billingServices`);
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
        services: services?.data?.data?.map((service) => new BillingService(service)) || [],
      };
};

export const getPendingEngagement = (serviceId: string | number): Promise<boolean> =>
  v6
    .get(`/services/${serviceId}/billing/engagement/request`)
    .then(() => true)
    .catch(() => false);
