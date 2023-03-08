export const VOLUME_OPTION_SNAPSHOT = 'SNAPSHOT';

export const VOLUME_OPTION_BACKUP = 'BACKUP';

export const VOLUMES_OPTIONS = [
  { id: 'volume_snapshot', type: VOLUME_OPTION_SNAPSHOT },
  { id: 'volume_backup', type: VOLUME_OPTION_BACKUP },
];

export const BACKUP_NAME_PREFIX = {
  [VOLUME_OPTION_SNAPSHOT]: 'volume-snapshot',
  [VOLUME_OPTION_BACKUP]: 'volume-backup',
};

export default {
  VOLUME_OPTION_SNAPSHOT,
  VOLUME_OPTION_BACKUP,
  VOLUMES_OPTIONS,
  BACKUP_NAME_PREFIX,
};
