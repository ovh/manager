import { APP_FEATURES, appName } from '@/App.constants';

export const subRoutes = {
  'general-information': '' as const,
  help: 'help' as const,
} as const;

export const urls = {
  root: `/${APP_FEATURES.appSlug}`,
  dashboard: `/${APP_FEATURES.appSlug}/dashboard`,
  onboarding: `/${APP_FEATURES.appSlug}/onboarding`,
  listing: `/${APP_FEATURES.appSlug}/listing`,
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

export const redirectionApp = appName;
