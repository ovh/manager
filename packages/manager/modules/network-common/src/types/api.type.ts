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

export enum Status {
  DONE = 'DONE',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
}

export type Task = {
  // yyyy-mm-ddTZ
  createdAt: string;
  errors?: { message: string }[];
  // yyyy-mm-ddTZ
  finishedAt?: string;
  id: string;
  link: string;
  message?: string;
  progress: {
    name: string;
    status: Status;
  }[];
  // yyyy-mm-ddTZ
  startedAt?: string;
  status: Status;
  type: string;
  // yyyy-mm-ddTZ
  updatedAt?: string;
};

export type AllowedServicesResponse = {
  cloudProject: string[] | null;
  dedicatedCloud: string[] | null;
  dedicatedCloudDatacenter: string[] | null;
  dedicatedConnect: string[] | null;
  dedicatedServer: string[] | null;
  dedicatedServerInterface:
    | {
        dedicatedServer: string;
        dedicatedServerInterface: string;
        name: string;
      }[]
    | null;
  ip: string[] | null;
  ipLoadbalancing: string[] | null;
  legacyVrack: string[] | null;
  ovhCloudConnect: string[] | null;
  vrackServices: string[] | null;
};

export type AllowedService =
  | 'cloudProject'
  | 'dedicatedCloud'
  | 'dedicatedCloudDatacenter'
  | 'dedicatedConnect'
  | 'dedicatedServer'
  | 'dedicatedServerInterface'
  | 'ip'
  | 'ipLoadbalancing'
  | 'legacyVrack'
  | 'ovhCloudConnect'
  | 'vrackServices';

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
