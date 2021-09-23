export const GUIDES = {
  ASIA: 'https://docs.ovh.com/asia/en/dedicated/ola-manager/',
  AU: 'https://docs.ovh.com/au/en/dedicated/ola-manager/',
  CA: 'https://docs.ovh.com/ca/en/dedicated/ola-manager/',
  DE: 'https://docs.ovh.com/de/dedicated/ola-manager/',
  ES: 'https://docs.ovh.com/es/dedicated/ola-manager/',
  FR: 'https://docs.ovh.com/fr/dedicated/ola-manager/',
  GB: 'https://docs.ovh.com/gb/en/dedicated/ola-manager/',
  IE: 'https://docs.ovh.com/ie/en/dedicated/ola-manager/',
  IT: 'https://docs.ovh.com/it/dedicated/ola-manager/',
  PL: 'https://docs.ovh.com/pl/dedicated/ola-manager/',
  PT: 'https://docs.ovh.com/pt/dedicated/ola-manager/',
  SG: 'https://docs.ovh.com/sg/en/dedicated/ola-manager/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360009918959-How-to-Configure-OVHcloud-Link-Aggregation-in-the-OVHcloud-Manager',
  default: 'https://docs.ovh.com/gb/en/dedicated/ola-manager/',
};

export const INTERFACE_TASK = 'INFRA_002_VirtualNetworkInterface';
export const INTERFACE_GROUP_TASK = 'INFRA_002_VirtualNetworkInterface_group';
export const INTERFACE_UNGROUP_TASK =
  'INFRA_002_VirtualNetworkInterface_ungroup';

export const PHYSICAL_TYPE = {
  public: 'public',
  private: 'private',
  privateLag: 'private_lag',
  provisioning: 'provisioning',
  isolated: 'isolated',
};

export const OLA_PLAN_CODE = 'ovh-link-aggregation-infra';

export const VIRTUAL_TYPE = {
  public: 'public',
  vrack: 'vrack',
  vrackAggregation: 'vrack_aggregation',
  publicAggregation: 'public_aggregation',
};

export default {
  GUIDES,
  INTERFACE_TASK,
  PHYSICAL_TYPE,
  OLA_PLAN_CODE,
  VIRTUAL_TYPE,
};
