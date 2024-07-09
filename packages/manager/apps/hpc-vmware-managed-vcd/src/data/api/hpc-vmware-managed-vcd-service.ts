import { apiClient } from '@ovh-ux/manager-core-api';
import { IBillingService } from '@/types/vcd-billing.interface';

export type TGetVcdServiceIdParams = {
  /** Filter on a specific kind of service */
  id: string;
};

export const getVcdServiceIdQueryKey = ({
  id = '',
}: TGetVcdServiceIdParams) => [`get/services${id}`];

export const getVcdServiceId = async ({ id }: TGetVcdServiceIdParams) => {
  const resourceName = id ? `?resourceName=${id}` : '';
  return apiClient.v6.get<number[]>(`/services${resourceName}`);
};

export const getBillingService = async ({ id }: TGetVcdServiceIdParams) => {
  const serviceId = await getVcdServiceId({ id });
  return apiClient.v6.get<IBillingService>(`/services/${serviceId.data[0]}`);
};
