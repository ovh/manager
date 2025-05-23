import JSURL from 'jsurl';
import {
  ProductConfiguration,
  BYOIP_FAILOVER_V4,
  BYOIP_PRODUCT_ID,
} from '@/data/hooks/catalog';

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

export const AS_OPTIONS = ['ovh_cloud', 'own'];

export type ByoipPayloadParams = {
  ipRir: string;
  ip: string;
  asRir: string;
  asNumber: number;
  campus: {
    name: string;
    planCode: string;
  };
};

export type ConfigItem = {
  label: keyof ByoipPayloadParams;
  values: (string | number | { name: string; planCode: string })[];
};

/**
 * Returns the express order settings
 */
export const getByoipProductSettings = (config: ConfigItem[]) =>
  JSURL.stringify({
    planCode: BYOIP_FAILOVER_V4,
    configuration: [...config].filter(Boolean),
    option: [],
    quantity: 1,
    productId: BYOIP_PRODUCT_ID,
  });
