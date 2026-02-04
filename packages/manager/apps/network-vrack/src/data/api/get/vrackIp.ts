import { v6 } from '@ovh-ux/manager-core-api';

export interface Ipv4Detail {
  gateway: string | null;
  ip: string;
  region: string | null;
}

export interface Ipv6Detail {
  ipv6: string;
  region: string | null;
}

export const getVrackIpv4List = async (serviceName: string): Promise<string[]> => {
  const { data } = await v6.get<string[]>(`/vrack/${serviceName}/ip`);
  return data;
};

export const getVrackIpv4Detail = async (serviceName: string, ip: string): Promise<Ipv4Detail> => {
  const { data } = await v6.get<Ipv4Detail>(`/vrack/${serviceName}/ip/${encodeURIComponent(ip)}`);
  return data;
};

export const getVrackIpv6List = async (serviceName: string): Promise<string[]> => {
  const { data } = await v6.get<string[]>(`/vrack/${serviceName}/ipv6`);
  return data;
};

export const getVrackIpv6Detail = async (serviceName: string, ip: string): Promise<Ipv6Detail> => {
  const { data } = await v6.get<Ipv6Detail>(`/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}`);
  return data;
};
