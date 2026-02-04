import { v6 } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

export const deleteVrackIpv4 = async (serviceName: string, ip: string): Promise<VrackTask> => {
  const { data } = await v6.delete<VrackTask>(`/vrack/${serviceName}/ip/${encodeURIComponent(ip)}`);
  return data;
};
