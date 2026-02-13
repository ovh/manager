export type TNetworkVisibility = 'private' | 'public';

export type TNetworkId = string;
export type TSubnetId = string;

export type TSubnet = {
  id: TSubnetId;
  name: string;
};

export type TNetwork = {
  id: TNetworkId;
  name: string;
  region: string;
  visibility: TNetworkVisibility;
  subnets?: TSubnet[];
};
