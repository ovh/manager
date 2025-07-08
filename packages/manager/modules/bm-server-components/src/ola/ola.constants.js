export const OLA_PLAN_CODE = 'ovh-link-aggregation-infra';

export const OLA_MODES = {
  DOUBLE_LAG: 'double_lag',
  FULL_LAG: 'full_lag',
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  VRACK_AGGREGATION: 'vrack_aggregation',
  PUBLIC_AGGREGATION: 'public_aggregation',
  PUBLIC: 'public',
  VRACK: 'vrack',
  DEFAULT: 'default',
};

export const INTERFACE_TASK = 'INFRA_002_VirtualNetworkInterface';
export const INTERFACE_GROUP_TASK = 'INFRA_002_VirtualNetworkInterface_group';
export const INTERFACE_UNGROUP_TASK =
  'INFRA_002_VirtualNetworkInterface_ungroup';

export const OLA_PREVIEW_ID = 'ola_preview';

export default {
  OLA_PLAN_CODE,
  OLA_MODES,
  INTERFACE_TASK,
  INTERFACE_GROUP_TASK,
  INTERFACE_UNGROUP_TASK,
  OLA_PREVIEW_ID,
};
