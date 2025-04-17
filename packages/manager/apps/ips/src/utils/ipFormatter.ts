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
