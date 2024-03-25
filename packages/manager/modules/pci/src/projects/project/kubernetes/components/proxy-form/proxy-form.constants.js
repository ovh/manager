export const DOCUMENTATION_LINK =
  'https://kubernetes.io/docs/reference/networking/virtual-ips/';

export const MODE = {
  iptables: { value: 'iptables', readableValue: 'IPTables' },
  ipvs: { value: 'ipvs', readableValue: 'IPVS' },
};

export const IPTABLES = {
  minSyncPeriod: 1,
  syncPeriod: 30,
};

export const IPVS = {
  minSyncPeriod: 0,
  scheduler: null,
  syncPeriod: 30,
  tcpFinTimeout: 0,
  tcpTimeout: 0,
  udpTimeout: 0,
};

export const SCHEDULER = ['dh', 'lc', 'nq', 'rr', 'sed', 'sh'];

export const ONE_YEAR_DURATION = 'P1Y';

export const TIMEOUT_MIN = 30;

export default {
  DOCUMENTATION_LINK,
  MODE,
  IPTABLES,
  IPVS,
  SCHEDULER,
  ONE_YEAR_DURATION,
  TIMEOUT_MIN,
};
