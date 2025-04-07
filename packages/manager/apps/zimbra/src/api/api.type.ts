export type AccountStatistics = {
  offer: string;
  configuredAccountsCount: number;
  availableAccountsCount: number;
};

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};

export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
  SUSPENDED = 'SUSPENDED',
}
