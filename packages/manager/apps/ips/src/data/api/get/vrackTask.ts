import { v6, ApiResponse } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@/types';

export type GetVrackTaskParams = {
  serviceName: string;
};

export const getVrackTaskQueryKey = (params: GetVrackTaskParams) => [
  'vRackTask',
  params.serviceName,
];

export const getVrackTaskList = ({
  serviceName,
}: GetVrackTaskParams): Promise<ApiResponse<number[]>> =>
  v6.get(`/vrack/${serviceName}/task`);

export type GetVrackTaskDetailsParams = {
  serviceName: string;
  taskId: number;
};

export const getVrackTaskDetailsQueryKey = (
  params: GetVrackTaskDetailsParams,
) => ['vRackTaskDetails', params.serviceName, params.taskId];

export const getVrackTaskDetails = ({
  serviceName,
  taskId,
}: GetVrackTaskDetailsParams): Promise<ApiResponse<VrackTask>> =>
  v6.get(`/vrack/${serviceName}/task/${taskId}`);
