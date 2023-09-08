export const RESET_CONFIRMATION_INPUT = /^RESET$/;

export const WORKER_NODE_POLICIES = {
  DELETE: 'delete',
  REINSTALL: 'reinstall',
};

export const KUBEPROXYMODE = {
  IPVS: 'ipvs',
  IPTABLES: 'iptables',
};

export const KUBEPROXYMODE_VALUE = {
  [KUBEPROXYMODE.IPVS]: {
    minSyncPeriod: 'PT0S',
    scheduler: null,
    syncPeriod: 'PT30S',
    tcpFinTimeout: 'PT0S',
    tcpTimeout: 'PT0S',
    udpTimeout: 'PT0S',
  },
  [KUBEPROXYMODE.IPTABLES]: {
    minSyncPeriod: 'PT1S',
    syncPeriod: 'PT0S',
  },
};

export const KUBEPROXYMODE_SCHEDULER = [
  null,
  'dh',
  'lc',
  'nq',
  'rr',
  'sed',
  'sh',
];

export default {
  RESET_CONFIRMATION_INPUT,
  WORKER_NODE_POLICIES,
  KUBEPROXYMODE,
  KUBEPROXYMODE_VALUE,
  KUBEPROXYMODE_SCHEDULER,
};
