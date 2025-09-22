export const SPECIAL_CONDITIONS_SUBSIDIARIES = ['US'];

export const TERMINATION_FORM_NAME = 'termination';

export const SERVICE_WITH_AGORA_TERMINATION = [
  'backup-veeam-vcd',
  'vrack-services',
  'okms',
  'logs-account',
  'nutanix',
  'vcd',
];

export const SERVICE_TYPES_WITH_AGORA_TERMINATION = ['domain'];

export const SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX = /hycu-vms-*|(logs-enterprise(-hds)?$)/;

export default {
  SPECIAL_CONDITIONS_SUBSIDIARIES,
  TERMINATION_FORM_NAME,
  SERVICE_WITH_AGORA_TERMINATION,
  SERVICE_GROUP_WITH_AGORA_TERMINATION_REGEX,
};
