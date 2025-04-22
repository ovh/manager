import { apiClient } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { BillingInfo } from '../types/billing.type';

export const getBillingInfoQueryKey = (serverName: string) => [
  `get/billing/server:${encodeURIComponent(JSON.stringify(serverName))}`,
];

export const getBillingInfo = async (
  serviceName: string,
): Promise<AxiosResponse<BillingInfo>> => {
  const { data } = await apiClient.v6.get<{ serviceId: string }>(
    `/dedicated/server/${serviceName}/serviceInfos`,
  );
  return apiClient.v6.get<BillingInfo>(`/services/${data.serviceId}`);
};
