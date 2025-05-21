export const ipFormatter = (ip: string) =>
  ip.indexOf('/32') !== -1 || ip.indexOf('/') === -1
    ? {
        ip: ip.replace('/32', ''),
        isGroup: false,
      }
    : {
        ip,
        isGroup: true,
      };

export const fromIpToId = (ip?: string) =>
  ip?.replace(/\./g, '-')?.replace(/\//g, '_');

export const fromIdToIp = (id?: string) =>
  id?.replace(/-/g, '.')?.replace(/_/g, '/');
