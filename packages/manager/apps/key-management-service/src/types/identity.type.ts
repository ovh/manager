export type IdentityType = 'user' | 'account' | 'group' | 'credential';
export type IdentityRegion = 'eu' | 'ca' | 'us' | 'labeu';
export type IdentityEntity = 'identity';

export type IdentityObject = {
  version: number;
  region: IdentityRegion;
  entity: IdentityEntity;
  type: IdentityType;
  account: string;
  id: string | null;
  urn: string;
};
