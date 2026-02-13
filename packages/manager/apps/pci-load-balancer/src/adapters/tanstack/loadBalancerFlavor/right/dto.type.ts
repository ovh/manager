export type TLoadBalancerFlavorDTO = {
  id: string;
  name: string;
  region: string;
};

export type TResizeLoadBalancerFlavorDTO = {
  flavorId: string;
  description?: string;
  name?: string;
};
