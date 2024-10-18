import { PaginationState } from '@ovh-ux/manager-react-components';

export interface Instance {
  id: string;
  name: string;
  ipAddresses: IPAddress[];
  flavorID: string;
  imageId: string;
  sshKeyId: string;
  created: string;
  region: string;
  monthlyBilling: MonthlyBilling | null;
  status: string;
  planCode: string;
  operationIds: string[];
  currentMonthOutgoingTraffice: number;
}

export interface MonthlyBilling {
  since: string;
  status: string;
}

export interface AssociatedEntity {
  gatewayId: string;
  id: string;
  ip: string;
  type: string;
  name: string;
}

export interface FloatingIP {
  associatedEntity: AssociatedEntity | null;
  id: string;
  ip: string;
  networkId: string;
  region: string;
  status: string;
  associatedEntityId: string;
  associatedEntityType: string;
  search?: string;
}

export interface FailoverIP {
  block: string;
  continentCode: string;
  geoloc: string;
  id: string;
  ip: string;
  progress: number;
  routedTo: string;
  status: string;
  subType: string;
  associatedEntityName: string;
}

export interface ImportsIP {
  ip: string;
  country: string;
  routedTo: { serviceName: string };
}

export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export interface ActionProps {
  ipId: string;
  projectId: string;
}

export interface TerminateIPProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export interface AttachInstanceProps {
  projectId: string;
  ipId: string;
  instanceId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export type ImportsOptions = {
  pagination: PaginationState;
};

export interface Region {
  region: string;
  status: string;
  openstackId: string;
}

export interface Network {
  id: string;
  name: string;
  vlanId: number;
  type: string;
  status: string;
  regions: Region[];
}

export interface IPAddress {
  ip: string;
  type: string;
  version: number;
  networkId: string;
  gatewayIp: string | null;
}

export interface Gateway {
  id: string;
  status: string;
  name: string;
  region: string;
  model: string;
  interfaces: Interface[];
  externalInformation: {
    ips: {
      ip: string;
      subnetId: string;
    }[];
    networkId: string;
  };
}

export interface Interface {
  id: string;
  ip: string;
  subnetId: string;
  networkId: string;
}

export interface UpdateInstanceProps {
  projectId: string;
  floatingIP: FloatingIP;
  instanceId: string;
  ipAddresses: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
