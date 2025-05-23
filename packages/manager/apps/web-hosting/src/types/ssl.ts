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

export type TCertificate = {
  isReportable: boolean;
  provider: string;
  regenerable: boolean;
  status: string;
  taskId?: number;
  type: string;
};
