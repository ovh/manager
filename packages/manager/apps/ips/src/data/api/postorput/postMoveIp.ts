import ipaddr from 'ipaddr.js';

import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

import { IpTypeEnum } from '@/data/constants';
import { IpTask, ipParkingOptionValue } from '@/types';
import { getTypeByServiceName } from '@/utils';

export type PostMoveIpParams = {
  ip: string;
  to: string;
  serviceName?: string | null;
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
