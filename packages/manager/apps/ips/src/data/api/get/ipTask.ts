import { v6, ApiResponse } from '@ovh-ux/manager-core-api';
import { IpTaskFunction, IpTaskStatus } from '@/types';

export type GetIpTaskParams = {
  ip: string;
  status: IpTaskStatus;
  fn: IpTaskFunction;
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
}: GetIpTaskParams): Promise<ApiResponse<number[]>> =>
  v6.get(`/ip/${encodeURIComponent(ip)}/task?function=${fn}&status=${status}`);
