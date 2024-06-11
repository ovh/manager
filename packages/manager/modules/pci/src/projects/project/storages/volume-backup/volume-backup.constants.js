export const VOLUME_BACKUP_ROOT_STATE =
  'pci.projects.project.storages.volume-backup';

export const VOLUME_BACKUP_ROUTES = {
  ROOT: { STATE: VOLUME_BACKUP_ROOT_STATE, URL: '/volume-backup' },
  CREATE: {
    STATE: `${VOLUME_BACKUP_ROOT_STATE}.create`,
    URL: '/create?volumeId',
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

export const VOLUME_BACKUP_BASE_TRACKING =
  'pci::projects::project::storages::volume-backup';

export const VOLUME_BACKUP_CTA_TRACKING = `PublicCloud::${VOLUME_BACKUP_BASE_TRACKING}`;

export const GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW =
  'storages_volume_backup_overview';
export const GUIDES_STORAGES_OVERVIEW = 'storages_overview';
export const GUIDES_INSTANCES_OVERVIEW = 'instances_overview';

export const VOLUME_BACKUP_TRACKING = {
  GUIDES: 'public-cloud_volume_backup::guides::go_to',
  ONBOARDING: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::onboarding`,
    ADD: `${VOLUME_BACKUP_CTA_TRACKING}::onboarding::add`,
    GUIDE: `${VOLUME_BACKUP_CTA_TRACKING}::onboarding::docs`,
  },
  CREATE: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::create-backup`,
    PRICE_LINK: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup::guide_${GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW}`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup_success`,
  },
  LISTING: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}`,
    ADD: `${VOLUME_BACKUP_CTA_TRACKING}::add`,
    ROW_CTA_RESTORE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::restore-volume`,
    ROW_CTA_CREATE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::create-volume`,
    ROW_CTA_DELETE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::delete-volume`,
  },
  RESTORE_VOLUME: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::restore`,
    CTA_CANCEL: `${VOLUME_BACKUP_CTA_TRACKING}::restore::cancel`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::restore::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::restore_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::restore_success`,
  },
  CREATE_VOLUME: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::create-volume`,
    CTA_CANCEL: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume::cancel`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume_success`,
  },
  DELETE_BACKUP: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::delete`,
    CTA_CANCEL: `${VOLUME_BACKUP_CTA_TRACKING}::delete::cancel`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::delete::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::delete_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::delete_success`,
  },
};

export const GUIDES = [
  {
    id: GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW,
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/volume-backup',
      ASIA: 'https://docs.ovh.com/asia/en/public-cloud/volume-backup',
      AU: 'https://docs.ovh.com/au/en/public-cloud/volume-backup',
      CA: 'https://docs.ovh.com/ca/en/public-cloud/volume-backup',
      DE: 'https://docs.ovh.com/de/public-cloud/volume-backup/',
      GB: 'https://docs.ovh.com/gb/en/public-cloud/volume-backup',
      IE: 'https://docs.ovh.com/ie/en/public-cloud/volume-backup',
      SG: 'https://docs.ovh.com/sg/en/public-cloud/volume-backup',
      ES: 'https://docs.ovh.com/es/public-cloud/volume-backup',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/15694887096851-How-to-Create-a-Volume-Backup',
      FR: 'https://docs.ovh.com/fr/public-cloud/volume-backup',
      QC: 'https://docs.ovh.com/ca/fr/public-cloud/volume-backup',
      IT: 'https://docs.ovh.com/it/public-cloud/volume-backup',
      PL: 'https://docs.ovh.com/pl/public-cloud/volume-backup',
      PT: 'https://docs.ovh.com/pt/public-cloud/volume-backup',
      WS: 'https://docs.ovh.com/us/es/public-cloud/volume-backup/',
    },
  },
  {
    id: GUIDES_STORAGES_OVERVIEW,
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
      SG: 'https://docs.ovh.com/sg/en/storage/',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
      WS: 'https://docs.ovh.com/us/es/storage/',
    },
  },
  {
    id: GUIDES_INSTANCES_OVERVIEW,
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
      PL: 'https://docs.ovh.com/pl/public-cloud/public-cloud-pierwsze-kroki/',
      PT: 'https://docs.ovh.com/pt/public-cloud/public-cloud-primeiros-passos/',
      QC:
        'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/4481009956243-How-to-Manage-Your-Public-Cloud-Instance',
      WS:
        'https://docs.ovh.com/us/es/public-cloud/public-cloud-primeros-pasos/',
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
