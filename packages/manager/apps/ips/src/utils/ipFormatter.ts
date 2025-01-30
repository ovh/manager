export const ipFormatter = (ipGroup: string) =>
  ipGroup.indexOf('/32') !== -1
    ? {
        ip: ipGroup.replace('/32', ''),
        isGroup: false,
      }
    : {
        ip: ipGroup.replace('/32', ''),
        isGroup: true,
      };
