export type DashboardTab = {
  name: string;
  title: string;
  to: string;
};

export const SERVICE_INFOS_STATUS = {
  AUTORENEW_IN_PROGRESS: 'autorenewInProgress',
  EXPIRED: 'expired',
  IN_CREATION: 'inCreation',
  Ok: 'ok',
  PENDING_DEPT: 'pendingDebt',
  UNPAID: 'unPaid',
};

export type AttachedDomain = {
  currentState: {
    fqdn: string;
    ssl: {
      status: string;
    };
    hosting: {
      serviceName: string;
    };
  };
};

export enum CertificateType {
  COMODO = 'COMODO',
  CUSTOM = 'CUSTOM',
  LETSENCRYPT = 'LETSENCRYPT',
  SECTIGO = 'SECTIGO',
}

export enum State {
  ACTIVE = 'ACTIVE',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  EXPIRED = 'EXPIRED',
  IMPORTING = 'IMPORTING',
  REGENERATING = 'REGENERATING',
}

export enum Status {
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
  WAITING_USER_INPUT = 'WAITING_USER_INPUT',
}

export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  SUSPENDED = 'SUSPENDED',
  UPDATING = 'UPDATING',
}

export type SslCertificate = {
  checksum: string;
  currentState: {
    additionalDomains: string[];
    certificateType: CertificateType;
    createdAt: string;
    expiredAt: string;
    mainDomain: string;
    state: State;
  };
  currentTasks: [
    {
      id: string;
      link: string;
      status: Status;
      type: string;
    },
  ];
  id: string;
  resourceStatus: ResourceStatus;
};

export type TCertificate = {
  isReportable: boolean;
  provider: string;
  regenerable: boolean;
  status: string;
  taskId?: number;
  type: string;
};
