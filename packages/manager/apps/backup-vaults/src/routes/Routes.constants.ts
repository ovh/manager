import { APP_FEATURES, appName } from '@/App.constants';

export const subRoutes = {
  'general-information': '' as const,
} as const;

export const urlParams = {
  vaultId: ':vaultId' as const,
} as const;

export const urls = {
  root: `/${APP_FEATURES.appSlug}`,
  dashboard: `/${APP_FEATURES.appSlug}/dashboard/${urlParams.vaultId}`,
  onboarding: `/${APP_FEATURES.appSlug}/onboarding`,
  listing: `/${APP_FEATURES.appSlug}/listing`,
} as const;

export const DASHBOARD_NAV_TABS = Object.freeze([
  {
    name: 'general-information',
    title: 'dashboard:general-information-tile',
    to: subRoutes['general-information'],
    pathMatchers: [/^\/general-information\/[^/]+$/],
    trackingActions: ['click::general-information-tile-tab'],
  }
]);

export const redirectionApp = appName;
