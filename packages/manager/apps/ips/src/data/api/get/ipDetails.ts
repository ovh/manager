import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/manager-react-components';
import { IpTypeEnum } from '@/data/constants';

export type GetIpDetailsParams = {
  ip: string;
};

export type IpDetails = {
  type: IpTypeEnum;
  regions: string[];
  campus: string;
  routedTo?: { serviceName: string };
  version: number;
  description: string | null;
  country: string;
  canBeTerminated: boolean;
  bringYourOwnIp?: boolean;
  iam: IamObject;
  organisationId?: string;
  rir?: string;
  isAdditionalIp?: boolean;
};

export const getIpDetailsQueryKey = (params: GetIpDetailsParams) => [
  `get/ip/${encodeURIComponent(params.ip)}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpDetails = async (
  params: GetIpDetailsParams,
): Promise<ApiResponse<IpDetails>> =>
  apiClient.v6.get<IpDetails>(`/ip/${encodeURIComponent(params.ip)}`);
