import { ChangelogLinks } from '@ovh-ux/manager-react-components';

export const ACTIVE_STATUS = ['ok', 'READY'];
export const PENDING_STATUS = ['PENDING', 'CREATING', 'UPDATING', 'DELETING'];

export const HORIZON_LINK = {
  EU: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  CA: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  US: 'https://horizon.cloud.ovh.us/auth/login?username={username}',
};

export const HORIZON_LINK_TRUSTED = {
  EU:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  CA:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  US: '',
};

export const ALPHA_CHARACTERS_REGEX = /^[a-zA-Z-]+$/;

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
