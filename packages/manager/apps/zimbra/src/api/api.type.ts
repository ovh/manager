export type AccountStatistics = {
  offer: string;
  configuredAccountsCount: number;
};
export type Task = {
  id: string;
  type: string;
  link: string;
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
export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
}
