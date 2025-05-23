import {
  IcebergFetchResultV6,
  fetchIcebergV6,
  v6,
  ApiResponse,
} from '@ovh-ux/manager-core-api';

export type GetIpReverseParams = {
  ip: string;
  ipReverse?: string;
};

export type IpReverseType = {
  ipReverse: string;
  reverse: string;
};

export const getIcebergIpReverseQueryKey = ({
  ip,
  ipReverse = '',
}: GetIpReverseParams) => [
  `get/iceberg/ip/${encodeURIComponent(ip)}/reverse/${ipReverse}`,
];

export const getIpReverseQueryKey = ({
  ip,
  ipReverse = '',
}: GetIpReverseParams) => [
  `get/ip/${encodeURIComponent(ip)}/reverse/${ipReverse}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIcebergIpReverse = async (
  params: GetIpReverseParams,
): Promise<IcebergFetchResultV6<IpReverseType>> =>
  fetchIcebergV6<IpReverseType>({
    route: `/ip/${encodeURIComponent(params.ip)}/reverse`,
    page: 1,
  });

export const getIpReverse = async ({
  ip,
  ipReverse,
}: GetIpReverseParams): Promise<ApiResponse<IpReverseType>> =>
  v6.get<IpReverseType>(
    `/ip/${encodeURIComponent(ip)}/reverse${
      ipReverse ? `/${encodeURIComponent(ipReverse)}` : ''
    }`,
  );
