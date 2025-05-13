import { ChangelogLinks } from '@ovh-ux/manager-react-components';

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
