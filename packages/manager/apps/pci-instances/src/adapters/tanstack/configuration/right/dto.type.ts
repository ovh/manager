export type TSshKeyDTO = {
  name: string;
  regions: string[];
};

type TBackupRegionDTO = {
  name: string;
  distantAutoBackupEnabled: boolean;
};

type TBackupPriceDTO = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

type TBackupPricingDTO = {
  regions: string[];
  price: TBackupPriceDTO;
  interval: 'hour' | 'month';
};

type TBackupModelDTO = {
  name: string;
  pricings: TBackupPricingDTO[];
};

export type TBackupConfigurationDTO = {
  regions: TBackupRegionDTO[];
  models: TBackupModelDTO[];
};

export type TCapabilityDTO = {
  type: 'PublicIP' | 'FloatingIP';
  enabled: boolean;
};

export type TSubnetDTO = {
  id: string;
  cidr: string;
  gatewayIp: string | null;
  capabilities: TCapabilityDTO[] | null;
};

export type TNetworkResourceDTO = {
  id: string;
  name: string;
  visibility: 'private' | 'public';
  vlanId: number | null;
  region: string;
  subnets: TSubnetDTO[] | null;
};

export type TNetworkDTO = {
  resources: TNetworkResourceDTO[];
};

export type TFloatingIpDTO = {
  id: string;
  ip: string;
};
