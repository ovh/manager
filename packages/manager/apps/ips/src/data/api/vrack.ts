import {
  ApiResponse,
  IcebergFetchResultV6,
  apiClient,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { ServiceStatus } from '@/types';
import { toServiceListItem } from '@/utils/toServiceListItem';

type Vrack = {
  name: string;
  description: string;
  iam: IamObject;
};

export const getVrackList = async (): Promise<IcebergFetchResultV6<{
  serviceName: string;
  displayName: string;
}>> => {
  const response = await fetchIcebergV6<Vrack>({
    route: '/vrack',
    pageSize: 1000,
  });

  return {
    ...response,
    data: response.data.map(toServiceListItem),
  };
};

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
