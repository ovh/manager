import { v6 } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

export const deleteVrackIpv6Subrange = async (
  serviceName: string,
  ip: string,
  subrange: string,
): Promise<VrackTask> => {
  const { data } = await v6.delete<VrackTask>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}/routedSubrange/${encodeURIComponent(subrange)}`,
  );
  return data;
};
