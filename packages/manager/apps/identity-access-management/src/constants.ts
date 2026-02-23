import { ChangelogLinks } from '@ovh-ux/manager-react-components';

export const IAM_FEATURES = {
  PERMANENT_TOKENS: 'identity-access-management:permanent-tokens',
};

export const CHANGELOG_LINKS: ChangelogLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?sliceBy%5Bvalue%5D=Identity+and+Access+Management+%28IAM%29',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?sliceBy%5Bvalue%5D=Identity+and+Access+Management+%28IAM%29',
  'feature-request':
    'https://github.com/ovh/management-security-operations-roadmap/issues/new/choose',
};

export const CHANGELOG_CHAPTERS = [
  'identity-security-operation',
  'identity-access-management',
  'identity-access-management',
];

export const API_MESSAGE_TOKEN_ALREADY_EXISTS = 'This token already exists';

export const PERMANENT_TOKENS_INPUT_MAX_LENGTH = 255;
export const PERMANENT_TOKENS_INPUT_PATTERN = /^[a-zA-Z0-9._ @-]+$/;
