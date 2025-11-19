import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import ipaddr from 'ipaddr.js';
import { ipParkingOptionValue, IpTask } from '@/types';
import { getTypeByServiceName } from '@/utils';
import { IpTypeEnum } from '@/data/constants';

export type PostMoveIpParams = {
  ip: string;
  to: string | typeof ipParkingOptionValue;
  serviceName: string;
  nexthop?: string;
};

export const postMoveIp = async ({
  ip,
  to,
  nexthop,
  serviceName,
}: PostMoveIpParams): Promise<ApiResponse<IpTask>> => {
  const isDetachedToParking = to === ipParkingOptionValue;
  const isAttachedToSomeVrack =
    getTypeByServiceName(serviceName) === IpTypeEnum.VRACK;

  if (isDetachedToParking && isAttachedToSomeVrack) {
    return apiClient.v6.delete(
      `/vrack/${serviceName}/${
        ipaddr.IPv6.isIPv6(ip) ? 'ipv6' : 'ip'
      }/${encodeURIComponent(ip)}`,
      {},
    );
  }

  return apiClient.v6.post(
    `/ip/${encodeURIComponent(ip)}/${isDetachedToParking ? 'park' : 'move'}`,
    isDetachedToParking
      ? {}
      : {
          to,
          nexthop,
        },
  );
};
