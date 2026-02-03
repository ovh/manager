export type TNetworkVisibility = 'private' | 'public';

export type TNetworkId = string;
export type TSubnetId = string;

export type TSubnet = {
  id: TSubnetId;
  name: string;
  cidr: string;
};

export type TNetwork = {
  id: TNetworkId;
  name: string;
  region: string;
  visibility: TNetworkVisibility;
  vlanId: number | null;
  subnets?: TSubnet[];
};
