import { v6 } from '@ovh-ux/manager-core-api';

export interface Ipv6BridgedSubrangeDetails {
  bridgedSubrange: string;
  gateway: string;
  slaac: 'enabled' | 'disabled';
}

export const getVrackIpv6BridgedSubranges = async (
  serviceName: string,
  ip: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}/bridgedSubrange`,
  );
  return data;
};

export const getVrackIpv6BridgedSubrangeDetail = async (
  serviceName: string,
  ip: string,
  bridgedSubrange: string,
): Promise<Ipv6BridgedSubrangeDetails> => {
  const { data } = await v6.get<Ipv6BridgedSubrangeDetails>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}/bridgedSubrange/${encodeURIComponent(bridgedSubrange)}`,
  );
  return data;
};
