import { APP_FEATURES, appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

const { isPci } = APP_FEATURES;

export const subRoutes = {
  'general-information': '' as const,
  help: 'help' as const,
  ...(isPci ? { quota: 'quota' as const } : {}),
} as const;

export const urls = {
  webDomains: 'web-domains',
  root: getRoot(),
  agGrid: 'ag-grid',
  group: `${getRoot()}/group`,
  dashboard: `dashboard`,
  onboarding: 'onboarding',
  listing: 'listing',
  listingTest: 'lt',
  nasha: 'nasha',
  all: 'all',
  recipes: 'recipes',
} as const;

export const DASHBOARD_NAV_TABS = Object.freeze([
  {
    name: 'general-information',
    title: 'dashboard:general-information',
    to: subRoutes['general-information'],
    pathMatchers: [/^\/general-information\/[^/]+$/],
    trackingActions: ['click::general-information-tab'],
  },
  {
    name: 'help',
    title: 'dashboard:help',
    to: subRoutes.help,
    pathMatchers: [/\/help$/],
    trackingActions: ['click::help-tab'],
  },
  // PCI-only tabs can be added here if needed
]);

export const redirectionApp = APP_FEATURES.isPci
  ? APP_FEATURES.appSlug // for PCI, shell expects the short app slug
  : appName;
