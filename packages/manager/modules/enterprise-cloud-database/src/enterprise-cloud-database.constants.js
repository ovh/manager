import PG_SQL from './assets/postgreSQL.svg';
import MARIA_DB from './assets/mariadb.svg';

export const OFFERS = {
  cluster16: 'Cluster 16',
  cluster32: 'Cluster 32',
  cluster64: 'Cluster 64',
  cluster128: 'Cluster 128',
};

export const PROCESSING_STATUS = [
  'configured',
  'creating',
  'deleting',
  'rebooted',
  'rebooting',
  'reinstalling',
  'reopening',
  'restarting',
  'scaling',
  'suspending',
  'updating',
];

export const ERROR_STATUS = ['suspended'];
export const SUCCESS_STATUS = ['created'];

export const DATABASE_CONSTANTS = {
  postgresql: {
    name: 'PostgresSQL',
    iconURL: PG_SQL,
  },
  mariadb: {
    name: 'MariaDB',
    iconURL: MARIA_DB,
  },
};

export const STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  CREATING: 'creating',
  DELETING: 'deleting',
  REOPENING: 'reopening',
  RESTARTING: 'restarting',
  SCALING: 'scaling',
  SUSPENDING: 'suspending',
  UPDATING: 'updating',
};

export const MASKED_PASSWORD = '********';
export const GUIDELINK = 'https://docs.ovh.com/fr/enterprise-cloud-databases/';
export const DELETE_CONFIRMATION_INPUT_PATTERN = /^DELETE$/;
export const ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9-_]{0,253}[a-zA-Z0-9]$/;
export const ENTERPRISE_CLOUD_DATABASE_BACKUP_NAME_PATTERN = /^[a-z][a-z0-9-_]{0,253}[a-z0-9]$/;
export const SERVICE_TYPE = 'ENTERPRISE_CLOUD_DATABASE';

export default {
  DATABASE_CONSTANTS,
  DELETE_CONFIRMATION_INPUT_PATTERN,
  ENTERPRISE_CLOUD_DATABASE_CLUSTER_NAME_PATTERN,
  ENTERPRISE_CLOUD_DATABASE_BACKUP_NAME_PATTERN,
  ERROR_STATUS,
  GUIDELINK,
  MASKED_PASSWORD,
  PROCESSING_STATUS,
  OFFERS,
  STATUS,
  SUCCESS_STATUS,
  SERVICE_TYPE,
};
