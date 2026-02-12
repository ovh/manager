import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IamObject } from '@ovh-ux/muk';

import { IpTypeEnum } from '@/data/constants';

export type GetIpDetailsParams = {
  ip: string;
};

export type IpDetails = {
  ip: string;
  type: IpTypeEnum;
  regions: string[];
  campus: string;
  routedTo?: { serviceName: string | null };
  version: number;
  description: string | null;
  country: string | null;
  canBeTerminated: boolean;
  bringYourOwnIp?: boolean;
  iam: IamObject;
  organisationId?: string | null;
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
