import JSURL from 'jsurl';
import {
  ProductConfiguration,
  BYOIP_FAILOVER_V4,
  BYOIP_PRODUCT_ID,
} from '@/data/hooks/catalog';
import { ipFormatter } from '@/utils';
import { IpDetails } from '@/data/api';
import { IpTypeEnum } from '@/data/constants';

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

export function canAggregateByoipIp({
  parentIpGroup = '',
  ip,
  isByoipSlice,
  ipDetails,
}: {
  parentIpGroup?: string;
  ip: string;
  isByoipSlice: boolean;
  ipDetails: IpDetails;
}) {
  const { range: parentIpRangeStr } = ipFormatter(parentIpGroup);
  const { range: rangeStr, isGroup } = ipFormatter(ip);
  const parentIpRange = parseInt(parentIpRangeStr, 10);
  const range = parseInt(rangeStr, 10);

  if (!ipDetails?.bringYourOwnIp) {
    return false;
  }

  if (isByoipSlice) {
    return parentIpRange > 24 && parentIpRange < 31;
  }

  return !isGroup || (range > 24 && range < 31);
}

export function canSliceByoipIp({
  ip,
  isByoipSlice,
  ipDetails,
}: {
  ip: string;
  isByoipSlice: boolean;
  ipDetails: IpDetails;
}) {
  const { range: rangeStr, isGroup } = ipFormatter(ip);
  const range = parseInt(rangeStr, 10);
  return ipDetails?.bringYourOwnIp && !isByoipSlice && isGroup && range < 32;
}

export function canTerminateByoipIp({
  parentIpGroup,
  isByoipSlice,
  ipDetails,
}: {
  parentIpGroup?: string;
  isByoipSlice: boolean;
  ipDetails: IpDetails;
}) {
  return (
    !!ipDetails?.canBeTerminated &&
    ipDetails.bringYourOwnIp &&
    !parentIpGroup &&
    [IpTypeEnum.ADDITIONAL, IpTypeEnum.PCC, IpTypeEnum.VRACK].includes(
      ipDetails?.type,
    ) &&
    !isByoipSlice
  );
}
