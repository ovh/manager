export const queryKey = <T extends Array<unknown>>(
  serviceName: string,
  keys: T,
): ['vps', string, ...T] => ['vps', serviceName, ...keys];
