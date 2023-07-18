export type ResponseData<T> = {
  status: number;
  data: T;
  code: string;
  // Error response
  response?: string;
};

export type Vrack = {
  name: string;
  description: string;
};

export type Tag = {
  name: string;
  description: string;
};

export type IamMetadata = {
  id: string;
  displayName?: string | null;
  tags: Tag[];
  urn: string;
};

export type VrackWithIAM = Vrack & IamMetadata;

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

export type EligibleManagedService = {
  managedServiceType: string;
  managedServiceURNs: string[];
};

export type Event = {
  // yyyy-mm-ddTZ
  createdAt: string;
  kind: string;
  link: string;
  message: string;
  type: string;
};

export enum Status {
  DONE = 'DONE',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
}

export type Task = {
  // yyyy-mm-ddTZ
  createdAt: string;
  errors: { message: string }[];
  // yyyy-mm-ddTZ
  finishedAt: string;
  id: string;
  link: string;
  message: string;
  progress: [
    {
      name: string;
      status: Status;
    },
  ];
  // yyyy-mm-ddTZ
  startedAt: string;
  status: Status;
  type: 'string';
  // yyyy-mm-ddTZ
  updatedAt: string;
};

export type AllowedServices = {
  cloudProject: string[];
  dedicatedCloud: string[];
  dedicatedCloudDatacenter: string[];
  dedicatedConnect: string[];
  dedicatedServer: string[];
  dedicatedServerInterface: {
    dedicatedServer: string;
    dedicatedServerInterface: string;
    name: string;
  }[];
  ip: string[];
  ipLoadbalancing: string[];
  legacyVrack: string[];
  ovhCloudConnect: string[];
};

export type EligibleServicesResponse = {
  createdAt: string;
  errors?: string[];
  result: {
    cloudProject: string[];
    dedicatedCloud: string[];
    dedicatedCloudDatacenter: string[];
    dedicatedConnect: string[];
    dedicatedServer: string[];
    dedicatedServerInterface: {
      dedicatedServer: string;
      dedicatedServerInterface: string;
      name: string;
    }[];
    ip: string[];
    ipLoadbalancing: string[];
    legacyVrack: string[];
    ovhCloudConnect: string[];
  };
  status: string;
};

export type NonExpiringService = {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  // date yyyy-mm-dd
  creation: string;
  domain: string;
  serviceId: number;
  status: 'expired' | 'inCreation' | 'ok' | 'pendingDebt' | 'unPaid';
};

export type IpBlock = unknown;
export type AllowedServiceEnum = unknown;
export type Ip = unknown;
export type Iplb = unknown;
export type PublicRoutingOption = unknown;
export type AccountId = string;
