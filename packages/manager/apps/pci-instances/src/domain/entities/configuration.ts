type TMicroRegionID = string;

export type TSshKey = {
  name: string;
  regions: string[];
};

export type TBackupPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
  type: 'hour' | 'month';
};

export type TBackupConfiguration = {
  region: TMicroRegionID;
  autoBackupEnabled: boolean;
  prices: TBackupPrice[];
};

type TNetworkID = string;
type TSubnetID = string;
type TCapability = 'PublicIP' | 'FloatingIP';

export type TNetwork = {
  id: TNetworkID;
  name: string;
  region: TMicroRegionID;
  vlanId: number;
  subnets: TSubnetID[];
};

export type TSubnet = {
  id: TSubnetID;
  cidr: string;
  capabilities: TCapability[];
  hasGateway: boolean;
};

export type TPrivateNetwork = {
  networks: {
    byId: Map<TNetworkID, TNetwork>;
    allIds: TNetworkID[];
  };
  subnets: {
    byId: Map<TSubnetID, TSubnet>;
    allIds: TSubnetID[];
  };
};

export type TFloatingIp = {
  id: string;
  ip: string;
};
