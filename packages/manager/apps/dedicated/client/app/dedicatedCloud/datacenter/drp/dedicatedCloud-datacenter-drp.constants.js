export const DEDICATEDCLOUD_DATACENTER_ZERTO = {
  title: 'ZERTO_OPTION_PCC',
  splitter: 'pcc-',
  alertPreference: 'ZERTO_ALERT_SUCCESS',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = {
  ovh: 'ovh',
  onPremise: 'onPremise',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS = [
  'broadcast',
  'gateway',
  'hsrp',
];

/* eslint-disable no-useless-escape */
export const DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP = new RegExp(
  '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/2[2-8]$',
);

export const DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP = new RegExp(
  '/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/',
);

export const DEDICATEDCLOUD_DATACENTER_DRP_STATUS = {
  delivered: 'delivered',
  delivering: 'delivering',
  disabled: 'disabled',
  disabling: 'disabling',
  error: 'error',
  provisionning: 'provisionning',
  toDisable: 'toDisable',
  toDo: 'todo',
  toProvision: 'toProvision',
  toUnprovision: 'toUnprovision',
  unprovisionning: 'unprovisionning',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_ROLES = {
  primary: 'primary',
  secondary: 'secondary',
  single: 'single',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS = {
  zertoOption: {
    ovh: 'pcc-option-zerto',
    onPremise: 'pcc-option-zerto-single',
  },
  productName: 'privateCloud',
  duration: 'P1M',
  quantity: 1,
};

export const DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES = [403, 460];

export const DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS = {
  configured: 'configured',
  configuring: 'configuring',
  error: 'error',
  notConfigured: 'notConfigured',
};

export default {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
};
