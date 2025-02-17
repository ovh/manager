import { ChangelogLinks } from '@ovh-ux/manager-react-components';
import { TRACKING } from './tracking.constants';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const CHANGELOG_CHAPTERS: string[] = TRACKING.servicesList
  .page()
  .split('::');
