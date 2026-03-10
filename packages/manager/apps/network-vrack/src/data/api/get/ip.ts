import { v6 } from '@ovh-ux/manager-core-api';

export interface IpDetail {
  ip: string;
  description: string;
  regions: string[];
}

export const getIpDetail = async (ip: string): Promise<IpDetail> => {
  const { data } = await v6.get<IpDetail>(`/ip/${encodeURIComponent(ip)}`);
  return data;
};
