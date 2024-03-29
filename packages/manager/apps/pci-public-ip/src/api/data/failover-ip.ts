import { v6 } from '@ovh-ux/manager-core-api';
import { FailoverIP } from '@/interface';

export const getAllFailoverIP = async (
  projectId: string,
): Promise<FailoverIP[]> => {
  const failoverIPs = await v6.get(`/cloud/project/${projectId}/ip/failover`);

  return failoverIPs.data;
};

export const terminateFailoverIP = async (ip: string) => {
  const { data } = await v6.post(`/ip/service/ip-${ip}/terminate`);
  return data;
};

export default { getAllFailoverIP };
