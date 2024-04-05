import { v6 } from '@ovh-ux/manager-core-api';
import { FailoverIP } from '@/interface';

export const getAllFailoverIP = async (
  projectId: string,
): Promise<FailoverIP[]> => {
  const failoverIPs = await v6.get(`/cloud/project/${projectId}/ip/failover`);

  return failoverIPs.data;
};

export const terminateFailoverIP = async (ipBlock: string) => {
  const [ip, block] = ipBlock.split('/');
  const { data } = await v6.post(
    `/ip/service/ip-${block === '32' ? ip : ipBlock}/terminate`,
  );
  return data;
};

export default { getAllFailoverIP };
