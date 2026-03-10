import { v6 } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

export interface BridgedSubrangeUpdate {
  slaac: 'enabled' | 'disabled';
}

export const putBridgedSubrange = async (
  serviceName: string,
  ipv6: string,
  bridgedSubrange: string,
  bridgedSubrangeDetail: BridgedSubrangeUpdate,
): Promise<VrackTask> => {
  const { data } = await v6.put<VrackTask>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6)}/bridgedSubrange/${encodeURIComponent(bridgedSubrange)}`,
    bridgedSubrangeDetail,
  );
  return data;
};
