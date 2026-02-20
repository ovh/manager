import { v6 } from '@ovh-ux/manager-core-api';

export interface VrackEligibleServices {
  result: {
    ip: string[];
    ipv6: string[];
  };
  status: 'pending' | 'done';
}

export const getVrackEligibleServices = async (
  serviceName: string,
): Promise<VrackEligibleServices> => {
  const { data } = await v6.get<VrackEligibleServices>(`/vrack/${serviceName}/eligibleServices`);
  return data;
};
