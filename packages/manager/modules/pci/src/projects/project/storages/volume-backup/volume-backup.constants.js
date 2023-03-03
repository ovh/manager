export const VOLUME_BACKUP_ROOT_STATE =
  'pci.projects.project.storages.volume-backup';

export const VOLUME_BACKUP_ROUTES = {
  ROOT: { STATE: VOLUME_BACKUP_ROOT_STATE, URL: '/volume-backup' },
  CREATE: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.create`,
    URL: '/create',
    ROUTES: {
      DETACH_VOLUME: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.create.detach-volume`,
        URL: '/detach-volume',
      },
    },
  },
  ONBOARDING: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.onboarding`,
    URL: '/onboarding',
  },
  LIST: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.list`,
    URL: '/list',
    ROUTES: {
      DELETE: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.list.delete`,
        URL: '/delete',
      },
      ATTACH_VOLUME: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.list.attach-volume`,
        URL: '/attach-volume',
      },
      RESTORE_VOLUME: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.list.restore-volume`,
        URL: '/restore-volume',
      },
      DASHBOARD: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.list.dashboard`,
        URL: '/:volumeBackupId',
      },
      CREATE_VOLUME: {
        STATE: `${VOLUME_BACKUP_ROOT_STATE}.list.create-volume`,
        URL: '/:volumeBackupId/create-volume',
      },
    },
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

export const VOLUME_BACKUP_TRACKING = {
  PREFIX: 'volume-backup',
};

export const GUIDES = [
  {
    id: 'storages_overview',
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/',
      ASIA: 'https://docs.ovh.com/asia/en/storage/',
      AU: 'https://docs.ovh.com/au/en/storage/',
      CA: 'https://docs.ovh.com/ca/en/storage/',
      DE: 'https://docs.ovh.com/de/storage/',
      ES: 'https://docs.ovh.com/es/storage/',
      FR: 'https://docs.ovh.com/fr/storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/',
      IE: 'https://docs.ovh.com/ie/en/storage/',
      IT: 'https://docs.ovh.com/it/storage/',
      PL: 'https://docs.ovh.com/pl/storage/',
      PT: 'https://docs.ovh.com/pt/storage/',
      QC: 'https://docs.ovh.com/ca/fr/storage/',
      SG: 'https://docs.ovh.com/sg/storage/',
      US: 'https://docs.ovh.com/us/en/storage/',
      WS: 'https://docs.ovh.com/us/es/storage/',
    },
  },
  {
    id: 'instances_overview',
    links: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
      ASIA:
        'https://docs.ovh.com/asia/en/public-cloud/public-cloud-first-steps/',
      AU: 'https://docs.ovh.com/au/en/public-cloud/public-cloud-first-steps/',
      CA: 'https://docs.ovh.com/ca/en/public-cloud/public-cloud-first-steps/',
      DE: 'https://docs.ovh.com/de/public-cloud/public-cloud-erste-schritte/',
      ES: 'https://docs.ovh.com/es/public-cloud/public-cloud-primeros-pasos/',
      FR:
        'https://docs.ovh.com/fr/public-cloud/premiers-pas-instance-public-cloud/',
      GB: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
      IT: 'https://docs.ovh.com/it/public-cloud/primi-passi-public-cloud/',
      NL: 'https://docs.ovh.com/nl/public-cloud/public-cloud-primeiros-passos/',
      PL: 'https://docs.ovh.com/pl/public-cloud/public-cloud-primeiros-passos/',
      PT: 'https://docs.ovh.com/pt/public-cloud/public-cloud-primeiros-passos/',
      QC:
        'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
      US: 'https://docs.ovh.com/us/en/public-cloud/public-cloud-first-steps/',
      WS:
        'https://docs.ovh.com/us/es/public-cloud/public-cloud-primeros-pasos/',
    },
  },
  {
    id: 'storages_volume_backup_overview',
    links: {
      DEFAULT: 'https://docs.ovh.com/en-gb/public-cloud/volume-backup/',
      ES: 'https://docs.ovh.com/es/public-cloud/volume-backup/',
      FR: 'https://docs.ovh.com/fr/public-cloud/volume-backup/',
      GB: 'https://docs.ovh.com/en-gb/public-cloud/volume-backup/',
      IT: 'https://docs.ovh.com/it/public-cloud/volume-backup/',
      NL: 'https://docs.ovh.com/nl/public-cloud/volume-backup/',
      PL: 'https://docs.ovh.com/pl/public-cloud/volume-backup/',
      PT: 'https://docs.ovh.com/pt/public-cloud/volume-backup/',
      US: 'https://docs.ovh.com/en-us/public-cloud/volume-backup/',
    },
  },
];

export default {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_STATUS,
  VOLUME_BACKUP_POLLER_NAMESPACES,
  VOLUME_BACKUP_DEFAULT_REGION,
  VOLUME_BACKUP_TRACKING,
  GUIDES,
};
