import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

export const getVrackTaskList = async (serviceName: string): Promise<number[]> => {
  const { data } = await v6.get<number[]>(`/vrack/${serviceName}/task`);
  return data;
};

export const getVrackTaskDetail = async (
  serviceName: string,
  taskId: number,
): Promise<ApiResponse<VrackTask>> => v6.get<VrackTask>(`/vrack/${serviceName}/task/${taskId}`);
