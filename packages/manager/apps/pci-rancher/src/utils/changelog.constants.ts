import { ChangelogLinks } from '@ovh-ux/manager-react-components';
import { TRACKING_PATH, TrackingPageView } from './tracking';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Rancher+Service',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Rancher+Service',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export const CHANGELOG_CHAPTERS: string[] = [
  ...TRACKING_PATH.split('::'),
  TrackingPageView.DetailRancher,
];
