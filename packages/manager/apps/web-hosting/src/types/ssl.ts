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

export type DomainDetails = {
  domain: string;
  additional: string;
  type: string;
  state: string;
  creationDate: string;
  expirationDate: string;
  setMessage?: ({ status, label }: { status: string; label: string }) => void;
};
