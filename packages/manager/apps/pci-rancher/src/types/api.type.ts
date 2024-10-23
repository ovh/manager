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

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string; class: string };
  };
};
export type OVHError = ErrorResponse['response']['data'];

export enum PciProjectPlanCode {
  DISCOVERY = 'project.discovery',
  STANDARD = 'project.2018',
}
export interface PciProject {
  access: string;
  creationDate: string;
  description: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
  planCode: PciProjectPlanCode;
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
    plan: RancherPlan['name'];
    region: string;
    version: string;
    usage?: {
      datetime: string;
      orchestratedVcpus: number;
    };
    ipRestrictions?: [
      {
        cidrBlock: string;
        description: string;
      },
    ];
    networking: {
      egressCidrBlocks: string[];
    };
  };
  currentTasks: Array<RancherTask>;
  resourceStatus: ResourceStatus;
}

export interface CreateRancherPayload {
  name: string;
  version: string;
  plan: string;
}

export enum ResourceStatus {
  READY = 'READY',
  DISABLED = 'DISABLED',
  UPDATING = 'UPDATING',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
}

export type RancherReferenceStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface RancherPlan {
  name: 'OVHCLOUD_EDITION' | 'STANDARD';
  status: RancherReferenceStatus;
}

export interface RancherVersion {
  name: string;
  status: RancherReferenceStatus;
  description?: string;
  changelogUrl?: string;
  cause?: 'CANNOT_UPGRADE_MULTIPLE_VERSIONS' | 'DEPRECATED' | 'DISABLED';
}

export enum RancherPlanName {
  OVHCLOUD_EDITION = 'OVHCLOUD_EDITION',
  STANDARD = 'STANDARD',
}

export enum RancherPlanCode {
  OVHCLOUD_EDITION = 'rancher.ovhcloud-edition.hour.consumption',
  STANDARD = 'rancher.standard.hour.consumption',
}

export type TPricing = {
  capacities: string[];
  mode: string;
  phase: number;
  commitment: number;
  description: string;
  price: number;
  tax: number;
  interval: number;
  intervalUnit: string;
  quantity: {
    max?: number;
    min?: number;
  };
  repeat: {
    max?: number;
    min?: number;
  };
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
  promotions: unknown[];
  engagementConfiguration?: unknown;
};

export type TRancherPricing = {
  name: string;
  hourlyPrice: number;
  monthlyPrice: number;
};
