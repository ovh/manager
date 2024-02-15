import { Task, IamMetadata } from '../api.type';

export type Region = {
  description: string;
  code: string;
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
  displayName?: string | null;
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

export enum ResourceStatus {
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

export type TargetSpec = {
  displayName?: string | null;
  subnets: Subnet[];
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
    region: string;
  };
  currentTasks: Task[];
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: TargetSpec;
  // yyyy-mm-ddTZ
  updatedAt: string;
};

export type VrackServicesWithIAM = VrackServices & IamMetadata;

export type UpdateVrackServicesParams = {
  checksum: string;
  targetSpec: TargetSpec;
  vrackServicesId: string;
};
