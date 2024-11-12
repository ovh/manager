import { Gateway, Subnet } from './private-network-form.type';

export enum NetworkVisibility {
  Private = 'private',
  Public = 'public',
}

type AllocationPools = {
  start: string;
  end: string;
};

export type TSubnet = {
  allocationPools?: AllocationPools[];
  allocatedIp?: string;
  cidr: string;
  dhcpEnabled: boolean;
  gatewayIp: string | null;
  gatewayName: string;
  networkId: string;
  region: string;
  ipVersion: number;
  id: string;
  name: string;
};

export type TNetwork = {
  id: string;
  name: string;
  region: string;
  visibility: NetworkVisibility;
  vlanId: number | null;
};

export type TGroupedNetwork = {
  vlanId: number;
  name: string;
  regions: string;
  search: string;
};

export type TNetworkCreationData = {
  name: string;
  subnet: Subnet;
  gateway?: Gateway;
  vlanId?: number;
};

export type TNetworkCreationParams = {
  projectId: string;
  region: string;
  data: TNetworkCreationData;
};

export type TNetworkCreationStatusParams = {
  projectId: string;
  operationId: string;
};

export enum CreationStatus {
  completed = 'completed',
  created = 'created',
  inError = 'in-error',
  inProgress = 'in-progress',
  unknown = 'unknown',
}

export type TNetworkCreationResponse = {
  action: 'network#create';
  completedAt: string | null;
  createdAt: string;
  id: string;
  progress: number;
  regions: string[];
  resourceId: string | null;
  startedAt: string | null;
  status: CreationStatus;
};

export type ErrorResponse = {
  response?: {
    data: {
      message: string;
    };
  };
  message?: string;
};
