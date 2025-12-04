import ipaddr from 'ipaddr.js';

export const ipFormatter = (ip: string) => {
  const [ipAddress, range] = ip.split('/');
  if (!range) {
    return {
      ip: ipAddress,
      ipAddress,
      ipGroup: `${ipAddress}/${ipaddr.IPv4.isIPv4(ip) ? 32 : 128}`,
      isGroup: false,
    };
  }
  if (
    (range === '32' && ipaddr.IPv4.isIPv4(ipAddress)) ||
    (range === '128' && ipaddr.IPv6.isIPv6(ipAddress))
  ) {
    return {
      ip: ipAddress,
      ipAddress,
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
    ipAddress,
    range,
    isGroup: true,
  };
};

export const fromIpToId = (ip?: string) =>
  ip?.replace(/\./g, '-')?.replace(/\//g, '_');

export const fromIdToIp = (id?: string) =>
  id?.replace(/-/g, '.')?.replace(/_/g, '/');
