import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export const getVrackList = (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get('/vrack');

export type VrackServiceInfos = {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  serviceId: number;
  status:
    | 'autorenewInProgress'
    | 'expired'
    | 'inCreation'
    | 'ok'
    | 'pendingDebt'
    | 'unPaid';
};

export const getVrackServiceInfos = (
  serviceName: string,
): Promise<ApiResponse<VrackServiceInfos>> =>
  apiClient.v6.get(`/vrack/${serviceName}/serviceInfos`);
