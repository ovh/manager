export type TInstance = {
  id: string;
  name: string;
  ipAddresses: TIPAddress[];
  flavorId: string;
  imageId: string;
  sshKeyId: string;
  created: string;
  region: string;
  regionName: string;
  monthlyBilling: TMonthlyBilling | null;
  status: string;
  statusGroup: string;
  planCode: string;
  operationIds: string[];
  currentMonthOutgoingTraffice: number;
  flavorName: string;
  search: string;
};

export type TMonthlyBilling = {
  since: string;
  status: string;
};

export type TRegion = {
  region: string;
  status: string;
  openstackId: string;
};

export type TIPAddress = {
  ip: string;
  type: string;
  version: number;
  networkId: string;
  gatewayIp: string | null;
};

export type TCapabilities = {
  failoverip: boolean;
  resize: boolean;
  snapshot: boolean;
  volume: boolean;
};

export type TPlanCodes = {
  monthly: string | null;
  hourly: string;
};

export type TFlavor = {
  id: string;
  name: string;
  region: string;
  ram: number;
  disk: number;
  vcpus: number;
  type: string;
  osType: string;
  inboundBandwidth: number;
  outboundBandwidth: number;
  available: boolean;
  planCodes: TPlanCodes;
  capabilities: TCapabilities;
  quota: number;
};
