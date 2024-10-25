export type Subnet = {
  cidr: string;
  enableDhcp: boolean;
  enableGatewayIp: boolean;
  ipVersion: number;
};

export type Gateway = {
  model: string;
  name: string;
};

export type NewPrivateNetworkForm = {
  region: string;
  isLocalZone: boolean;
  name: string;
  defaultVlanId: number;
  vlanId: number;
  subnet: Subnet;
  gateway?: Gateway;
  existingGatewayId?: string | boolean;
};
