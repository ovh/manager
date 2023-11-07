import { Task, IamMetadata } from '../api.type';

export type Zone = {
  description: string;
  name: string;
};

export type Endpoint = {
  endpoints?: [
    {
      description: string;
      ip: string;
    },
  ];
  managedServiceURN: string;
};

export type Subnet = {
  cidr: string;
  displayName: string | null;
  serviceEndpoints: Endpoint[];
  serviceRange: {
    cidr: string;
    remainingIps?: number;
    reservedIps?: number;
    usedIps?: number;
  };
  vlan: number | null;
};

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DRAFT = 'DRAFT',
}

export enum ResoureceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
}

export type EligibleManagedService = {
  managedServiceType: string;
  managedServiceURNs: string[];
};

export type VrackServices = {
  checksum: string;
  // yyyy-mm-ddTZ
  createdAt: string;
  currentState: {
    displayName: string | null;
    productStatus: ProductStatus;
    subnets: Subnet[];
    vrackId: string | null;
    zone: string;
  };
  currentTasks: Task[];
  id: string;
  resourceStatus: ResoureceStatus;
  targetSpec: {
    displayName: string | null;
    subnets: Subnet[];
  };
  // yyyy-mm-ddTZ
  updatedAt: string;
};

export type VrackServicesWithIAM = VrackServices & IamMetadata;
