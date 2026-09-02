export const SPECIAL_CONDITIONS_SUBSIDIARIES = ['US'];

export const TERMINATION_FORM_NAME = 'termination';

export const SERVICE_WITH_AGORA_TERMINATION = [
  'backup-veeam-vcd',
  'backup-tenant',
  'vspc-tenant',
  'vrack-services',
  'okms',
  'logs-account',
  'nutanix',
  'vcd',
  'hosting-free-100m',
  'hosting-starter',
  'hosting-perso',
  'hosting-startup',
  'hosting-pro',
  'hosting-performance-1',
  'hosting-agency',
  'hosting-agency-plus',
  'hosting-agency-max',
  'cloudweb1',
  'cloudweb2',
  'cloudweb3',
  'managed-cms-10',
  'managed-cms-50',
  'managed-cms-100',
  'managed-cms-1',
  'video-center-plus',
  'video-center-pro',
];

export const SERVICE_TYPES_WITH_AGORA_TERMINATION = ['domain'];

export const SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX = /hycu-vms-*|(logs-enterprise(-hds)?$)|^backup-vault-paygo/;

export default {
  SPECIAL_CONDITIONS_SUBSIDIARIES,
  TERMINATION_FORM_NAME,
  SERVICE_WITH_AGORA_TERMINATION,
  SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX,
};
