import { COLD_ARCHIVE_STATES as STATES } from '../cold-archives.constants';

export const COLD_ARCHIVE_STATES = STATES;

export const COLD_ARCHIVE_CONTAINER_STATUS = {
  ARCHIVED: 'archived',
  ARCHIVING: 'archiving',
  DELETING: 'deleting',
  FLUSHED: 'flushed',
  NONE: 'none',
  RESTORED: 'restored',
  RESTORING: 'restoring',
};

export const CONTAINER_STATUS_OPTIONS = {
  none: {
    actions: ['archive', 'delete'],
    componentClass: 'oui-badge oui-badge_sold-out',
  },
  archiving: {
    actions: [],
    componentClass: 'oui-badge oui-badge_info',
  },
  archived: {
    actions: ['restore', 'delete'],
    componentClass: 'oui-badge oui-badge_success',
  },
  restoring: {
    actions: [],
    componentClass: 'oui-badge oui-badge_info',
  },
  restored: {
    actions: ['delete'],
    componentClass: 'oui-badge oui-badge_success',
  },
  deleting: {
    actions: [],
    componentClass: 'oui-badge oui-badge_warning',
  },
  flushed: {
    actions: [],
    componentClass: 'oui-badge oui-badge_error',
  },
};

export const GUIDES = [
  {
    id: 'public-cloud-create-project',
    links: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/premiers-pas-instance-public-cloud/',
      CA:
        'https://docs.ovh.com/ca/en/public-cloud/premiers-pas-instance-public-cloud/',
      DE:
        'https://docs.ovh.com/de/public-cloud/premiers-pas-instance-public-cloud/',
      ES:
        'https://docs.ovh.com/es/public-cloud/premiers-pas-instance-public-cloud/',
      FR:
        'https://docs.ovh.com/fr/public-cloud/premiers-pas-instance-public-cloud/',
      GB:
        'https://docs.ovh.com/gb/en/public-cloud/premiers-pas-instance-public-cloud/',
      It:
        'https://docs.ovh.com/it/public-cloud/premiers-pas-instance-public-cloud/',
      PL:
        'https://docs.ovh.com/pl/public-cloud/premiers-pas-instance-public-cloud/',
      PT:
        'https://docs.ovh.com/pt/public-cloud/premiers-pas-instance-public-cloud/',
      QC:
        'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
    },
  },
  {
    id: 'storage-backup',
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/',
      CA: 'https://docs.ovh.com/ca/en/storage/',
      DE: 'https://docs.ovh.com/de/storage/',
      ES: 'https://docs.ovh.com/es/storage/',
      FR: 'https://docs.ovh.com/fr/storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/',
      IT: 'https://docs.ovh.com/it/storage/',
      PL: 'https://docs.ovh.com/pl/storage/',
      PT: 'https://docs.ovh.com/pt/storage/',
      QC: 'https://docs.ovh.com/ca/fr/storage/',
    },
  },
];

export default {
  GUIDES,
  CONTAINER_STATUS_OPTIONS,
  COLD_ARCHIVE_STATES,
};
