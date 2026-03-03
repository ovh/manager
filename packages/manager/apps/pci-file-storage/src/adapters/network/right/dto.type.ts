export type TNetworkVisibilityDto = 'private' | 'public';

export type TNetworkDto = {
  id: string;
  name: string;
  region: string;
  visibility: TNetworkVisibilityDto;
  vlanId: number | null;
};

export type TSubnetDto = {
  id: string;
  name: string;
  cidr: string;
};
