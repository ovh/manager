import { apiClient } from '@ovh-ux/manager-core-api';
import { IBillingService } from '@/types/vcd-billing.interface';

export const getVcdServiceId = async (id: string) => {
  const resourceName = id ? `?resourceName=${id}` : '';
  return apiClient.v6.get<number[]>(`/services${resourceName}`);
};

export const getBillingService = async (id: string) => {
  const serviceId = await getVcdServiceId(id);
  return apiClient.v6.get<IBillingService>(`/services/${serviceId.data[0]}`);
};
