export const DEFAULT_CIDR = 16;

export const DEFAULT_IP = '10.{vlanId}.0.0';

export const DEFAULT_VLAN_ID = 0;

export const NETWORK_ACTIVE_STATUS = 'ACTIVE';

export const VLAN_ID = {
  MIN: 2,
  MAX: 4000,
};

export const GUIDE_LINKS = {
  PRIVATE_NETWORK_WITH_GATEWAY:
    'https://docs.ovh.com/gb/en/public-cloud/creating-private-network-with-gateway/',
  REGION_AVAILABILITY:
    'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
};

export const TRACKING_PREFIX = 'PublicCloud::add-private-network';

export default {
  DEFAULT_CIDR,
  DEFAULT_IP,
  NETWORK_ACTIVE_STATUS,
  VLAN_ID,
  GUIDE_LINKS,
  TRACKING_PREFIX,
};
