export type TInstance = {
  created: string;
  currentMonthOutgoingTraffic?: number;
  flavorId: string;
  id: string;
  imageId: string;
  ipAddresses: {
    gatewayIp?: string;
    ip: string;
    networkId: string;
    type: string;
    version: number;
  }[];
  monthlyBilling?: {
    since: string;
    status: 'activationPending' | 'ok';
  };
  name: string;
  operationIds: string[];
  planCode: string;
  region: string;
  sshKeyId?: string;
  status: string;
};
