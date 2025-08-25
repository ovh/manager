import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { ipParkingOptionValue, IpTask } from '@/types';

export type PostMoveIpParams = {
  ip: string;
  to: string | typeof ipParkingOptionValue;
  nexthop?: string;
};

export const postMoveIp = async ({
  ip,
  to,
  nexthop,
}: PostMoveIpParams): Promise<ApiResponse<IpTask>> => {
  const isDetachedToParking = to === ipParkingOptionValue;
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
