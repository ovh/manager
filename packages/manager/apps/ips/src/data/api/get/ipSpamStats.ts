import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpSpamStatsParams = {
  ip: string;
  ipSpamming?: string;
};

type DetectedSpams = {
  date: number;
  destinationIp: string;
  messageId: string;
  spamscore: number;
};

export type IpSpamStatType = {
  averageSpamscore: number;
  detectedSpams: DetectedSpams[];
  numberOfSpams: number;
  timestamp: number;
  total: number;
};

export const getIpSpamStatsQueryKey = (params: GetIpSpamStatsParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/spam/${
    params.ipSpamming ? encodeURIComponent(params.ipSpamming) : ''
  }/stats`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpSpamStats = async (
  params: GetIpSpamStatsParams,
): Promise<IcebergFetchResultV6<IpSpamStatType>> =>
  fetchIcebergV6<IpSpamStatType>({
    route: `/ip/${encodeURIComponent(params.ip)}/spam/${encodeURIComponent(
      params.ipSpamming || '',
    )}/stats`,
    page: 1,
    disableCache: true,
  });
