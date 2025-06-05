import {
  ChangelogLinks,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';

export const PRIVATE_REGISTRY_STATUS = {
  ERROR: 'ERROR',
  READY: 'READY',
  DELETED: 'DELETED',
  SUSPENDED: 'SUSPENDED',
  INSTALLING: 'INSTALLING',
  UPDATING: 'UPDATING',
  RESTORING: 'RESTORING',
  SUSPENDING: 'SUSPENDING',
  DELETING: 'DELETING',
  SCALING_UP: 'SCALING_UP',
};

export const GUIDES = [
  {
    id: 'configure',
    link: 'https://docs.ovh.com/',
  },
  {
    id: 'registry',
    link: 'https://docs.ovh.com/',
  },
  {
    id: 'deploy',
    link: 'https://docs.ovh.com/',
  },
];

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Private+Registry',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Private+Registry',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const IAM_DOC_LINKS: Partial<{ [key in OvhSubsidiary]: string }> = {
  DEFAULT:
    'https://www.ovhcloud.com/en/identity-security-operations/identity-access-management/',
  FR:
    'https://www.ovhcloud.com/fr/identity-security-operations/identity-access-management/',
  MA:
    'https://www.ovhcloud.com/fr-ma/identity-security-operations/identity-access-management/',
  TN:
    'https://www.ovhcloud.com/fr-tn/identity-security-operations/identity-access-management/',
  SN:
    'https://www.ovhcloud.com/fr-sn/identity-security-operations/identity-access-management/',
  QC:
    'https://www.ovhcloud.com/fr-ca/identity-security-operations/identity-access-management/',
  GB:
    'https://www.ovhcloud.com/en-gb/identity-security-operations/identity-access-management/',
  IE:
    'https://www.ovhcloud.com/en-ie/identity-security-operations/identity-access-management/',
  WE:
    'https://www.ovhcloud.com/en/identity-security-operations/identity-access-management/',
  CA:
    'https://www.ovhcloud.com/en-ca/identity-security-operations/identity-access-management/',
  AU:
    'https://www.ovhcloud.com/en-au/identity-security-operations/identity-access-management/',
  SG:
    'https://www.ovhcloud.com/en-sg/identity-security-operations/identity-access-management/',
  ASIA:
    'https://www.ovhcloud.com/asia/identity-security-operations/identity-access-management/',
  IN:
    'https://www.ovhcloud.com/en-in/identity-security-operations/identity-access-management/',
  ES:
    'https://www.ovhcloud.com/es-es/identity-security-operations/identity-access-management/',
  WS:
    'https://www.ovhcloud.com/es/identity-security-operations/identity-access-management/',
  PT:
    'https://www.ovhcloud.com/pt/identity-security-operations/identity-access-management/',
  IT:
    'https://www.ovhcloud.com/it/identity-security-operations/identity-access-management/',
  PL:
    'https://www.ovhcloud.com/pl/identity-security-operations/identity-access-management/',
  DE:
    'https://www.ovhcloud.com/de/identity-security-operations/identity-access-management/',
  NL:
    'https://www.ovhcloud.com/nl/identity-security-operations/identity-access-management/',
};
