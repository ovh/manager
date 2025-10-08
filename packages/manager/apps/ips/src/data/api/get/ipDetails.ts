import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { IpTypeEnum } from '@/data/constants';

export type GetIpDetailsParams = {
  ip: string;
};

export type IpRoutedToType = {
  serviceName: string;
};

export type IpDetails = {
  type: IpTypeEnum;
  regions: string[];
  campus: string;
  routedTo?: IpRoutedToType;
  version: number;
  description: string;
  country: string;
  canBeTerminated: boolean;
  bringYourOwnIp?: boolean;
};

export const getIpDetailsQueryKey = (params: GetIpDetailsParams) => [
  `get/ip/${encodeURIComponent(params.ip)}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpdetails = async (
  params: GetIpDetailsParams,
): Promise<ApiResponse<IpDetails>> =>
  apiClient.v6.get<IpDetails>(`/ip/${encodeURIComponent(params.ip)}`);
