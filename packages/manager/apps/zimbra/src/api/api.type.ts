export type AccountStatistics = {
  offer: string;
  configuredAccountsCount: number;
};

export type ZimbraPlatform = {
  id: string;
  resourceStatus: string;
  checksum: string;
  targetSpec: {
    name: string;
    description: string;
    numberOfOrganizations: number;
    accountsStatistics: AccountStatistics[];
    quota: number;
  };
  currentState: {
    name: string;
    description: string;
    numberOfOrganizations: number;
    accountsStatistics: AccountStatistics[];
    quota: number;
  };
  currentTasks: Array<{
    id: string;
    type: string;
    link: string;
  }>;
  iam: {
    id: string;
    urn: string;
  };
};

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};

export type Organization = {
  id: string;
  resourceStatus: string;
  checksum: string;
  targetSpec: {
    name: string;
    description: string;
    label: string;
    storageConsumed: number;
    updatedAt: string;
    createdAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentState: {
    name: string;
    description: string;
    label: string;
    storageConsumed: number;
    updatedAt: string;
    createdAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentTasks: Task[];
};

export type OrganizationBodyParams = {
  description?: string;
  label?: string;
  name?: string;
};

export type Domain = {
  checksum: string;
  currentState: {
    authoritative: boolean;
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: ResourceStatus;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status: ResourceStatus;
    type: string;
  }>;
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    authoritative: boolean;
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: ResourceStatus;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
  };
};

export type TaskErrorMessage = {
  message: string;
};

export type TaskProgressStatus = {
  name: string;
  status: string;
};

export type Task = {
  createdAt: string;
  errors: TaskErrorMessage[];
  finishedAt: string;
  id: string;
  link: string;
  message: string;
  progress: TaskProgressStatus[];
  startedAt: string;
  status: string;
  type: string;
  updatedAt: string;
};

export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
}

export type Email = {
  checksum: string;
  currentState: {
    contactInformation: {
      city: string;
      company: string;
      country: string;
      faxNumber: string;
      mobileNumber: string;
      office: string;
      phoneNumber: string;
      postcode: string;
      profession: string;
      service: string;
      street: string;
    };
    createdAt: string;
    description: string;
    detailedStatus: {
      details: string;
      link: string;
      status: TaskErrorMessage;
    }[];
    displayName: string;
    domainId: string;
    email: string;
    firstName: string;
    hideInGal: boolean;
    lastConnectionAt: string;
    lastName: string;
    organizationId: string;
    organizationLabel: string;
    offer: string;
    password: string;
    quota: {
      available: number;
      used: number;
    };
    resourceName: string;
    responder: string;
  };
  currentTasks: {
    id: string;
    link: string;
    status: 'ERROR' | '...';
    type: string;
  }[];
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    contactInformation: {
      city: string;
      company: string;
      country: string;
      faxNumber: string;
      mobileNumber: string;
      office: string;
      phoneNumber: string;
      postcode: string;
      profession: string;
      service: string;
      street: string;
    };
    createdAt: string; // ISO 8601 date string
    description: string;
    detailedStatus: {
      details: string;
      link: string;
      status: string;
    }[];
    displayName: string;
    domainId: string;
    email: string;
    firstName: string;
    hideInGal: boolean;
    lastConnectionAt: string;
    lastName: string;
    organizationId: string;
    organizationLabel: string;
    offer: string;
    password: string;
    quota: {
      available: number;
      used: number;
    };
    resourceName: string;
    responder: string;
  };
};
