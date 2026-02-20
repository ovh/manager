import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

export const postAttachIpv4ToVrack = ({
  serviceName,
  ip,
  region,
}: {
  serviceName: string;
  ip: string;
  region: string;
}): Promise<ApiResponse<VrackTask>> =>
  v6.post<VrackTask>(`/vrack/${serviceName}/ip`, {
    block: ip,
    region,
  });

export const postAttachIpv6ToVrack = ({
  serviceName,
  ip,
}: {
  serviceName: string;
  ip: string;
}): Promise<ApiResponse<VrackTask>> =>
  v6.post<VrackTask>(`/vrack/${serviceName}/ipv6`, {
    block: ip,
  });
