export type AccountStatistics = {
  offer: string;
  configuredAccountsCount: number;
};

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};

export type TaskErrorMessage = {
  message: string;
};

export type TaskProgressStatus = {
  name: string;
  status: string;
};

export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
}
