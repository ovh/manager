import { ChangelogMenu, ChangelogMenuLinks } from '@ovh-ux/muk';

const kmsChangelogLinks: ChangelogMenuLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?sliceBy%5Bvalue%5D=Key+Management+Service',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?sliceBy%5Bvalue%5D=Key+Management+Service',
  'feature-request': 'https://github.com/ovh/management-security-operations-roadmap/issues/new',
};

export const KmsChangelogButton = () => {
  return <ChangelogMenu links={kmsChangelogLinks} />;
};
