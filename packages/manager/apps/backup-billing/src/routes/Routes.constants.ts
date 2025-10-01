import { APP_FEATURES, appName } from '@/App.constants';

const ROOT_URL = `/${APP_FEATURES.appSlug}`;

export const subRoutes = {
  'general-information': '' as const,
  help: 'help' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  listing: '',
  dashboard: 'dashboard',
  onboarding: 'onboarding',
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
]);

export const redirectionApp = appName;
 