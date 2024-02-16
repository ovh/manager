export const DOCUMENTATION_LINK =
  'https://kubernetes.io/docs/reference/networking/virtual-ips/';

export const MODE = {
  iptables: 'iptables',
  ipvs: 'ipvs',
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

export default {
  DOCUMENTATION_LINK,
  MODE,
  IPTABLES,
  IPVS,
  SCHEDULER,
  ONE_YEAR_DURATION,
};
