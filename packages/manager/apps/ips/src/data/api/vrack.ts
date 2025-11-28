import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { ServiceStatus } from '@/types';

export type VrackServiceInfos = {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  serviceId: number;
  status: ServiceStatus;
};

export const getVrackServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<VrackServiceInfos>> =>
  apiClient.v6.get(`/vrack/${serviceName}/serviceInfos`);
