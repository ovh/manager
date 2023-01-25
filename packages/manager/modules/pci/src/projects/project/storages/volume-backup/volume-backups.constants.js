export const VOLUME_BACKUP_ROOT_STATE =
  'pci.projects.project.storages.volume-backup';

export const VOLUME_BACKUP_ROUTES = {
  ROOT: { STATE: VOLUME_BACKUP_ROOT_STATE, URL: '/volume-backup' },
  ADD: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.add`,
    URL: '/create',
  },
  ONBOARDING: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.onboarding`,
    URL: '/onboarding',
  },
  DASHBOARD: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.dashboard`,
    URL: '/dashboard',
  },
};

export const VOLUME_BACKUP_STATUS = {
  CREATING: 'creating',
  DELETING: 'deleting',
  ERROR: 'error',
  OK: 'ok',
  RESTORING: 'restoring',
};

export const VOLUME_BACKUP_POLLER_NAMESPACES = {
  CHANGING: 'pci.projects.project.storages.volume-backup',
};

export const VOLUME_BACKUP_DEFAULT_REGION = 'RBX';

export default {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_STATUS,
  VOLUME_BACKUP_POLLER_NAMESPACES,
  VOLUME_BACKUP_DEFAULT_REGION,
};
