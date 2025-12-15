import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { BillingInfo } from '../types/billing.type';

export const getBillingInfoQueryKey = (serverName: string) => [
  `get/billing/server:${encodeURIComponent(JSON.stringify(serverName))}`,
];

export const getBillingInfo = async (
  serviceName: string,
  isNutanix = false,
  cluster?: string,
): Promise<ApiResponse<BillingInfo>> => {
  const pathType = isNutanix ? 'nutanix' : 'dedicated/server';
  const { data } = await apiClient.v6.get<{ serviceId: string }>(
    `/${pathType}/${isNutanix ? cluster : serviceName}/serviceInfos`,
  );
  return apiClient.v6.get<BillingInfo>(`/services/${data.serviceId}`);
};
