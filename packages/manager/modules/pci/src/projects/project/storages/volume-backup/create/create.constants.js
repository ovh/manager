export const VOLUME_OPTION_SNAPSHOT = 'SNAPSHOT';

export const VOLUME_OPTION_BACKUP = 'BACKUP';

export const VOLUMES_OPTIONS = [
  {
    id: 'volume_snapshot',
    planCode: 'volume.snapshot.consumption',
    type: VOLUME_OPTION_SNAPSHOT,
  },
  {
    id: 'volume_backup',
    planCode: 'volume-backup.storage.hour.consumption',
    type: VOLUME_OPTION_BACKUP,
  },
];

export const BACKUP_NAME_PREFIX = {
  [VOLUME_OPTION_SNAPSHOT]: 'snapshot',
  [VOLUME_OPTION_BACKUP]: 'backup',
};

export default {
  VOLUME_OPTION_SNAPSHOT,
  VOLUME_OPTION_BACKUP,
  VOLUMES_OPTIONS,
  BACKUP_NAME_PREFIX,
};
