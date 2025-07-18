export const MIGRATION_STATUS = {
  available: 'available',
  notAvailable: 'notAvailable',
  ongoing: 'ongoing',
  planned: 'planned',
  toPlan: 'toPlan',
};

export const MESSAGE_CONTAINER = 'vps.outperform';

export const VPS_VERSION_2019 = '2019v1';

export const MAX_DISK_SIZE = 400;

export const EXCLUDES_VPS_NAME_REGEX = /vps-starter|vps-le/;

export default {
  EXCLUDES_VPS_NAME_REGEX,
  MAX_DISK_SIZE,
  MESSAGE_CONTAINER,
  MIGRATION_STATUS,
  VPS_VERSION_2019,
};
