import { ChangelogMenuLinks } from '@ovh-ux/muk';

export const appName = 'observability';

export const AppConfig = {
  rootLabel: appName,
} as const;

export type DashboardsApi = 'v2';

export const APP_FEATURES = {
  basePrefix: '',
} as const;

export const CHANGELOG_LINKS: ChangelogMenuLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Observability',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Observability',
  'feature-request':
    'https://github.com/ovh/observability-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
