import { v6, ApiResponse } from '@ovh-ux/manager-core-api';
import { IpTaskFunction, IpTaskStatus } from '@/types';

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
    `/ip/${encodeURIComponent(ip)}/task${
      params.toString() ? '?' : ''
    }${params.toString()}`,
  );
};
