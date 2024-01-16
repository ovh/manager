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

export interface PciProject {
  access: string;
  creationDate: string;
  description: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
}

export enum RancherTaskType {
  RANCHER_UPDATE = 'RANCHER_UPDATE',
  RANCHER_CREATE = 'RANCHER_CREATE',
  RANCHER_DELETE = 'RANCHER_DELETE',
  RANCHER_ADMIN_CREDENTIALS_RESET = 'RANCHER_ADMIN_CREDENTIALS_RESET',
}
export interface RancherTask {
  id: string;
  type: RancherTaskType;
}
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
    usage: {
      datetime: string;
      orchestratedVcpus: number;
    };
    ipRestrictions?: [
      {
        cidrBlock: string;
        description: string;
      },
    ];
  };
  currentTasks: Array<RancherTask>;
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
