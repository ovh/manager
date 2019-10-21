export const INTERFACE_TASK = 'INFRA_002_VirtualNetworkInterface';

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
};

export default {
  INTERFACE_TASK,
  PHYSICAL_TYPE,
  OLA_PLAN_CODE,
  VIRTUAL_TYPE,
};
