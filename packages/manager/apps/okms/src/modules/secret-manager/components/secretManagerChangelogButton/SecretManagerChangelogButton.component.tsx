import React from 'react';
import {
  ChangelogButton,
  ChangelogLinks,
} from '@ovh-ux/manager-react-components';

const secretManagerChangelogLinks: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?sliceBy%5Bvalue%5D=Secret+Manager',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?sliceBy%5Bvalue%5D=Secret+Manager',
  'feature-request':
    'https://github.com/ovh/management-security-operations-roadmap/issues/new',
};

export const SecretManagerChangelogButton = () => {
  return <ChangelogButton links={secretManagerChangelogLinks} />;
};
