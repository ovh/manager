import { Prefix } from 'ip.js';
import ipaddr from 'ipaddr.js';

export const ipFormatter = (
  ip: string,
): {
  ip: string;
  ipAddress: string;
  ipGroup: string;
  range?: number;
  isGroup: boolean;
} => {
  const [ipAddress, range] = ip.split('/');
  if (!range) {
    return {
      ip: ipAddress,
      ipAddress: ipAddress,
      ipGroup: `${ipAddress}/${ipaddr.IPv4.isIPv4(ip) ? 32 : 128}`,
      isGroup: false,
    };
  }
  if (
    (range === '32' && ipaddr.IPv4.isIPv4(ipAddress || '')) ||
    (range === '128' && ipaddr.IPv6.isIPv6(ipAddress || ''))
  ) {
    return {
      ip: ipAddress,
      ipAddress: ipAddress,
      ipGroup: ip,
      isGroup: false,
    };
  }
  return {
    ipGroup: ip,
    ip,
    /**
     * Group prefix
     */
    ipAddress: ipAddress,
    range: parseInt(range, 10),
    isGroup: true,
  };
};

export const fromIpToId = (ip = '') =>
  ip?.replace(/\./g, '-')?.replace(/\//g, '_');

export const fromIdToIp = (id = '') =>
  id?.replace(/-/g, '.')?.replace(/_/g, '/');

/**
 * Return list of all ips in the given ipGroup
 */
export const getIpv4SubIpList = (ipGroup: string) => {
  const prefix = new Prefix(ipGroup);
  if (!prefix.isIPv4() || !ipGroup.includes('/') || ipGroup.includes('/32')) {
    return [];
  }
  return (
    prefix.slice(32).map((addr) => addr.toString().replace('/32', '')) || []
  );
};
