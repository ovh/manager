export type TLoadBalancer = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  flavorId: string;
  operatingStatus: string;
  provisioningStatus: string;
  vipAddress: string;
  vipNetworkId: string;
  vipSubnetId: string;
  region: string;
};

export type TLoadBalancerResponse = {
  resources: TLoadBalancer[];
  errors: unknown[];
};
