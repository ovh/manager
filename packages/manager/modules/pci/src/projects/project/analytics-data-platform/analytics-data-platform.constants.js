export const ANALYTICS_DATA_PLATFORM_PUBLIC_CLOUD_STATUS = Object.freeze({
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
  SUSPENDED: 'suspended',
});

export const ANALYTICS_DATA_PLATFORM_NODE_TYPES = Object.freeze({
  MASTER: 'MASTER',
  WORKER: 'SLAVE',
  EDGE: 'EDGE',
  UTILITY: 'UTILITY',
  BASTION: 'BASTION',
});

export const ANALYTICS_DATA_PLATFORM_COMPUTE = Object.freeze({
  RAM: 'RAM',
  CORS: 'vCores',
});

export const ANALYTICS_DATA_PLATFORM_GUIDE_LINKS = Object.freeze({
  general_link: 'https://docs.ovh.com/gb/en/analytics/',
});

export const ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE = Object.freeze({
  AMBARI: 'https://knox.serviceName.datalake.ovh/gateway/default/ambari',
  FREEIPA: 'https://ipa.serviceName.datalake.ovh',
  RANGER:
    'https://knox.serviceName.datalake.ovh/gateway/default/ranger/login.jsp',
});

export const ANALYTICS_DATA_PLATFORM_NODE_NAMES = [
  'worker',
  'edge',
  'master',
  'utility',
  'bastion',
];

export const ANALYTICS_DATA_PLATFORM_CLOUD_CATALOG_NAME = 'cloud';

export const ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES = Object.freeze([
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
    types: [
      'ovh.ssd.gpu',
      'ovh.ssd.gpu2',
      'ovh.ssd.gpu3',
      'ovh.ssd.fpga2',
      'ovh.raid-nvme.t1',
    ],
  },
  {
    id: 'vps',
    types: ['ovh.vps-ssd'],
  },
]);

export const ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO = Object.freeze({
  credentials: [
    {
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
    },
  ],
  rounds: 100000,
  dkLen: 32,
  passwordLength: 18,
  minMasterPasswordLength: 12,
  maxMasterPasswordLength: 64,
});

export const ANALYTICS_DATA_PLATFORM_NODE_FILTERS = ['Node type', 'Region'];

export const ANALYTICS_DATA_PLATFORM_STATUS_MAP = Object.freeze({
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
  INITIALIZED: 'info',
});

export const ANALYTICS_DATA_PLATFORM_STATUS = Object.freeze({
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
  INITIALIZED: 'INITIALIZED',
});

export const ANALYTICS_DATA_PLATFORM_SERVICES = Object.freeze({
  AMBARI: 'AMBARI',
  FREEIPA: 'FREEIPA',
  RANGER: 'RANGER',
});

export const ANALYTICS_DATA_PLATFORM_CLUSTER_NAME_PATTERN = /^[a-z][a-z0-9-]{1,18}[a-z0-9]$/;
export const ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN = /^\d+$/;

export default {
  ANALYTICS_DATA_PLATFORM_PUBLIC_CLOUD_STATUS,
  ANALYTICS_DATA_PLATFORM_CLOUD_CATALOG_NAME,
  ANALYTICS_DATA_PLATFORM_CLUSTER_MANAGE,
  ANALYTICS_DATA_PLATFORM_CREDENTIALS_INFO,
  ANALYTICS_DATA_PLATFORM_FLAVOR_TYPES,
  ANALYTICS_DATA_PLATFORM_STATUS_MAP,
  ANALYTICS_DATA_PLATFORM_GUIDE_LINKS,
  ANALYTICS_DATA_PLATFORM_NODE_NAMES,
  ANALYTICS_DATA_PLATFORM_NODE_TYPES,
  ANALYTICS_DATA_PLATFORM_SERVICES,
  ANALYTICS_DATA_PLATFORM_STATUS,
  ANALYTICS_DATA_PLATFORM_COMPUTE,
  ANALYTICS_DATA_PLATFORM_NODE_FILTERS,
  ANALYTICS_DATA_PLATFORM_CLUSTER_NAME_PATTERN,
  ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN,
};
