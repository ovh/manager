import {
  ApiResponse,
  IcebergFetchResultV6,
  fetchIcebergV6,
  v6,
} from '@ovh-ux/manager-core-api';

import { IpTask, IpTaskFunction, IpTaskStatus } from '@/types';

export const getIcebergIpTaskList = (
  ip: string,
): Promise<IcebergFetchResultV6<IpTask>> =>
  fetchIcebergV6({
    route: `/ip/${encodeURIComponent(ip)}/task`,
    pageSize: 10000,
    page: 1,
    disableCache: true,
  });

export type GetIpTaskParams = {
  ip: string;
  status?: IpTaskStatus;
  fn?: IpTaskFunction;
};

export const getIpTaskQueryKey = (params: GetIpTaskParams) => [
  'ipTask',
  params.fn,
  params.status,
  params.ip,
];

export const getIpTaskList = ({
  ip,
  status,
  fn,
}: GetIpTaskParams): Promise<ApiResponse<number[]>> => {
  const params = new URLSearchParams();
  if (fn) {
    params.append('function', fn);
  }
  if (status) {
    params.append('status', status);
  }

  return v6.get(
    `/ip/${encodeURIComponent(ip)}/task${params.toString() ? '?' : ''}${params.toString()}`,
  );
};

export type GetIpTaskDetailsParams = {
  ip: string;
  taskId: number;
};

export const getIpTaskDetailsQueryKey = (params: GetIpTaskDetailsParams) => [
  'ipTaskDetails',
  params.ip,
  params.taskId,
];

export const getIpTaskDetails = ({
  ip,
  taskId,
}: GetIpTaskDetailsParams): Promise<ApiResponse<IpTask>> =>
  v6.get(`/ip/${encodeURIComponent(ip)}/task/${taskId}`);
