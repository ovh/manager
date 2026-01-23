export type TNetworkVisibilityDto = 'private' | 'public';

export type TNetworkDto = {
  id: string;
  name: string;
  region: string;
  visibility: TNetworkVisibilityDto;
};
