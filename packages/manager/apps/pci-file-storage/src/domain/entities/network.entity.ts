export type TNetworkVisibility = 'private' | 'public';

export type TNetworkId = string;

export type TNetwork = {
  id: TNetworkId;
  name: string;
  region: string;
  visibility: TNetworkVisibility;
};
