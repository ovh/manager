import { v6 } from '@ovh-ux/manager-core-api';

export interface Ipv6RoutedSubrangeDetails {
  nexthop: string;
  routedSubrange: string;
}

export const getVrackIpv6RoutedSubranges = async (
  serviceName: string,
  ip: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}/routedSubrange`,
  );
  return data;
};

export const getVrackIpv6RoutedSubrangeDetail = async (
  serviceName: string,
  ip: string,
  routedSubrange: string,
): Promise<Ipv6RoutedSubrangeDetails> => {
  const { data } = await v6.get<Ipv6RoutedSubrangeDetails>(
    `/vrack/${serviceName}/ipv6/${encodeURIComponent(ip)}/routedSubrange/${encodeURIComponent(routedSubrange)}`,
  );
  return data;
};
