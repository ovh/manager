import { ProductConfiguration } from '@/data/hooks/catalog';

export const getConfigValues = (
  configs: ProductConfiguration[] = [],
  configName: string,
) => {
  return configs.find((config) => config.name === configName)?.values || [];
};

// Regular expression pattern for /24 subnet
export const pattern = /^(?:(?:25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\/((19|2[0-4]))?)$/;

export const ipRangePlaceholder = '192.168.22.42/24';

const byoipIpRangeRe = new RegExp(pattern);

// The subnet address is limited to only "/24".
export const isValidIpRange = (subnet: string): boolean =>
  byoipIpRangeRe.test(subnet);
