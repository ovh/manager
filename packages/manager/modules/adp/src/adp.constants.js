export const ADP_PUBLIC_CLOUD_STATUS = Object.freeze({
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
  SUSPENDED: 'suspended',
});

export const ADP_NODE_TYPES = Object.freeze({
  MASTER: 'MASTER',
  WORKER: 'SLAVE',
  EDGE: 'EDGE',
  UTILITY: 'UTILITY',
  BASTION: 'BASTION',
});

export const ADP_COMPUTE = Object.freeze({
  RAM: 'RAM',
  CORS: 'vCores',
});

export const ADP_GUIDE_LINKS = Object.freeze({
  general_link: 'https://docs.ovh.com/gb/en/analytics/',
});

export const ADP_CLUSTER_MANAGE = Object.freeze({
  AMBARI: 'https://knox.serviceName.datalake.ovh/gateway/default/ambari',
  FREEIPA: 'https://ipa.serviceName.datalake.ovh',
  RANGER: 'https://knox.serviceName.datalake.ovh/gateway/default/ranger/login.jsp',
});

export const ADP_NODE_NAMES = ['worker', 'edge', 'master', 'utility', 'bastion'];

export const ADP_CLOUD_CATALOG_NAME = 'cloud';

export const ADP_FLAVOR_TYPES = Object.freeze([
  {
    id: 'balanced',
    types: ['ovh.ceph.eg', 'ovh.ssd.eg'],
  },
  {
    id: 'cpu',
    types: ['ovh.cpu', 'ovh.ssd.cpu', 'ovh.ceph.hg'],
  },
  {
    id: 'ram',
    types: ['ovh.ram', 'ovh.ssd.ram'],
  },
  {
    id: 'accelerated',
    types: ['ovh.ssd.gpu', 'ovh.ssd.gpu2', 'ovh.ssd.gpu3', 'ovh.ssd.fpga2', 'ovh.raid-nvme.t1'],
  },
  {
    id: 'vps',
    types: ['ovh.vps-ssd'],
  },
]);

export const ADP_CREDENTIALS_INFO = Object.freeze({
  credentials: [{
    key: 'admin_password',
    login: 'admin',
    service: 'Ambari',
    password: 'Not generated',
  },
  {
    key: 'admin_password',
    login: 'admin',
    service: 'FreeIPA',
    password: 'Not generated',
  },
  {
    key: 'kerberos',
    login: 'admin',
    service: 'Kerberos KDC',
    password: 'Not generated',
  },
  {
    key: 'kms_passwd',
    login: 'admin',
    service: 'Ranger KMS',
    password: 'Not generated',
  },
  {
    key: 'admin_password_guacamole',
    login: 'guacadmin',
    service: 'Guacamole',
    password: 'Not generated',
  },
  {
    key: 'mysql_root_password',
    login: 'root',
    service: 'MariaDB SQL server',
    password: 'Not generated',
  },
  {
    key: 'hive',
    login: 'hive',
    service: 'Hive BDD',
    password: 'Not generated',
  },
  {
    key: 'oozie',
    login: 'oozie',
    service: 'Oozie BDD',
    password: 'Not generated',
  },
  {
    key: 'ambari',
    login: 'ambari',
    service: 'Ambari BDD',
    password: 'Not generated',
  },
  {
    key: 'guacamole',
    login: 'guacamole',
    service: 'Guacamole BDD',
    password: 'Not generated',
  }],
  rounds: 100000,
  dkLen: 32,
  passwordLength: 18,
  minMasterPasswordLength: 12,
});

export const ADP_NODE_FILTERS = [
  'Node type',
  'Region',
];

export const ADP_STATUS_MAP = {
  PENDING: 'info',
  IN_PROGRESS: 'warning',
  SUCCEEDED: 'success',
  FAILED: 'error',
  DONE: 'success',
  ERROR: 'error',
  UNKNOWN: 'warning',
  OK: 'success',
  TO_DEPLOY: 'info',
  DEPLOYING: 'warning',
  DEPLOYED: 'success',
  TO_DESTROY: 'info',
  DESTROYED: 'error',
};

export const ADP_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  DONE: 'DONE',
  ERROR: 'ERROR',
  UNKNOWN: 'UNKNOWN',
  OK: 'OK',
  TO_DEPLOY: 'TO_DEPLOY',
  DEPLOYING: 'DEPLOYING',
  DEPLOYED: 'DEPLOYED',
  TO_DESTROY: 'TO_DESTROY',
  DESTROYED: 'DESTROYED',
};

export const ADP_SERVICES = Object.freeze({
  AMBARI: 'AMBARI',
  FREEIPA: 'FREEIPA',
  RANGER: 'RANGER',
});

export default {
  ADP_PUBLIC_CLOUD_STATUS,
  ADP_CLOUD_CATALOG_NAME,
  ADP_CLUSTER_MANAGE,
  ADP_CREDENTIALS_INFO,
  ADP_FLAVOR_TYPES,
  ADP_STATUS_MAP,
  ADP_GUIDE_LINKS,
  ADP_NODE_NAMES,
  ADP_NODE_TYPES,
  ADP_SERVICES,
  ADP_STATUS,
  ADP_COMPUTE,
  ADP_NODE_FILTERS,
};
