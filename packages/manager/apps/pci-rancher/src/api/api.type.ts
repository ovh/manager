export type ResponseData<T = unknown> = {
  headers: Record<string, string>;
  status: number;
  data?: T;
  code: string;
  response?: {
    status: number;
    data: { message: string };
  };
  detail?: {
    status: number;
  };
};

export interface RancherService {
  id: string;
  createdAt: string;
  updatedAt: string;
  targetSpec: {
    name: string;
    plan: string;
    version: string;
    ipRestrictions: [
      {
        cidrBlock: string;
        description: string;
      },
    ];
  };
  currentState: {
    url: string;
    name: string;
    plan: string;
    region: string;
    version: string;
    ipRestrictions: [
      {
        cidrBlock: string;
        description: string;
      },
    ];
  };
  currentTasks: [];
  resourceStatus: RessourceStatus;
}

export enum RessourceStatus {
  READY = 'READY',
  DISABLED = 'DISABLED',
  UPDATING = 'UPDATING',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
}
